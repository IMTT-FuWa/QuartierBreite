import some from 'lodash/some';
/**
* return sub state tree
* depth beginning at given in stateKey
**/
export function getSubStateTreeByKey(stateKey: string, tree: Object) {
    return iterate(tree);

    // recursivly iterates over all children to find subtree
    function iterate(o) {
        var subtree;

        // check if url key is on this layer
        var keyInO = some(Object.keys(o), function (key) {
            return key == stateKey;
        });

        // if it is on this layer, we can return sub tree immideately
        if (keyInO) {
            subtree = o[stateKey];
            // if not, check children of each entry
        } else {
            Object.keys(o).forEach(function (key) {
                // return if we found it already
                if (subtree) return;
                // if this branch has children
                if (o[key].children) {
                    // iterate over them and return if recursion provides subtree
                    if (subtree = iterate(o[key].children)) {
                        return;
                    }
                }
            });
        }

        return subtree;
    }
}

/**
* returns Module classes (@page classes or external Module constructors)
* of all modules, that have a "key" property with value "expectedValue" in their
* proberty "moduleData"
**/
export function getModulesByModuleDataKey(tree: Object, key: string, expectedValue: any): Array<any> {
    let out: Array<any> = filterFlat(tree, key, expectedValue);
    return out;

    function filterFlat(o: Object, key: string, value: any) {
        let results: Array<Object> = [],
            childKeys: Array<string> = Object.keys(o);

        childKeys.forEach((childKey) => {

            let child = o[childKey],
                isModuleWithData: boolean = child.hasOwnProperty('module') && child.hasOwnProperty('moduleData');

            // check: - if child is a module with moduleData configuration
            //        - its moduleData has the searched key
            //        - the key has the searched value
            if (isModuleWithData && child.moduleData.hasOwnProperty(key) && child.moduleData[key] == value) {
                results.push(child);
            }

            if (child.hasOwnProperty('children') && Object.keys(child.children).length) {
                results = results.concat(filterFlat(child.children, key, value));
            }
        });

        return results;
    }
}
