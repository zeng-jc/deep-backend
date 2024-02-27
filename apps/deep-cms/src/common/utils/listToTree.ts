export function listToTree(
  list: {
    [prop: string]: any;
  }[],
  parentFiledName: string,
  subFiledName: string,
) {
  const info = list.reduce((map, node) => {
    const obj = {};
    Object.keys(node).forEach((item) => {
      if (
        item !== 'path' &&
        item !== 'component' &&
        item !== 'name' &&
        item !== 'redirect' &&
        item !== 'id' &&
        item !== 'parentId'
      ) {
        obj[item] = node[item];
        delete node[item];
      }
    });
    node.meta = obj;
    return (map[node.id] = node), (node[subFiledName] = []), map;
  }, {});

  return list.filter((node) => {
    info[node[parentFiledName]] && info[node[parentFiledName]][subFiledName].push(node);
    delete node.parentId;
    return !node[parentFiledName];
  });
}
