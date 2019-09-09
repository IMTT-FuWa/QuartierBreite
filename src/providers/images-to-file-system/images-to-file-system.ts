import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { File } from '@ionic-native/file';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class ImagesToFileSystemProvider {

  constructor(private file: File, private af: AngularFireDatabase) {
    this.file.checkDir(this.file.externalRootDirectory, "QuartierBilder").then(
      //do nothing if dir already exists
    ).catch(() => {
      //create directory for saving images
      this.file.createDir(this.file.externalRootDirectory, "QuartierBilder", false).then(_x => {
      }).catch(error => {
        console.log(error)
      });
    });
  }

  public b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    let sliceSize = 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  public saveImagesFromChat(chatName, context) {
    let chatMessageSubscription = this.af.list(context).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }).subscribe(messages => {
      for (let chatMessage of messages) {
        if (chatMessage.image) {
          this.createImageFiles(chatName, chatMessage, false);
        }
      }
    });
    setTimeout(() => {
      chatMessageSubscription.unsubscribe();
    }, 10000);
  }

  public saveImagesFromBlackboard(proposal) {
    if (proposal.document) {
      this.createImageFiles(proposal.title, proposal, true);
    }
  }

  private createImageFiles(name, message, backendNubedian: boolean) {
    console.log("saving image to device");
    const dir = this.file.externalRootDirectory + "QuartierBilder/";
    let formatDate = moment(message.timestamp).locale('de').format('DD-MM-YY_HH-mm-ss');
    const fileName = name + "_" + formatDate + ".jpg";
    const contentType = "image/jpg";
    let b64Data;
    if (backendNubedian) {
      b64Data = message.document;
    }
    else {
      b64Data = message.image.split(",")[1];
    }
    this.file.checkFile(dir, fileName).catch(error => { console.log(error) }).then(file => {
      if (!file) {
        this.file.writeFile(dir, fileName, this.b64toBlob(b64Data, contentType)).then(_x => {
        }).catch(error => { console.log(error) });
      }
    }).catch(error => {
      console.log(error);
    });
  }

}
