export class ChatUtils {
  
  public static uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public static sortParticipantsByDate(participants) {
    participants.sort(function (a, b) {
      if (!a.timestamp && !b.timestamp) {
        return 0;
      }
      else if (!a.timestamp && b.timestamp) {
        return 1;
      }
      else if (a.timestamp && !b.timestamp) {
        return -1;
      }
      else if (a.timestamp && b.timestamp) {
        var dateA = a.timestamp, dateB = b.timestamp;
        if (dateA > dateB) { //sort string ascending
          return -1;
        }
        if (dateA < dateB) {
          return 1;
        }
        return 0; //default return value (no sorting)
      }
    });
    return participants;
  }
}
