export function listToTree(
  list: {
    [prop: string]: any;
  }[],
  parentFiledName: string,
  subFiledName: string,
) {
  const info = list.reduce((map, node) => ((map[node.id] = node), (node[subFiledName] = []), map), {});
  return list.filter((node) => {
    info[node[parentFiledName]] && info[node[parentFiledName]][subFiledName].push(node);
    return !node[parentFiledName];
  });
}
