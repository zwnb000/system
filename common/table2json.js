function f(table,parentId=0) {
  let arr = [];
  for(let i=0;i<table.length;i++){
    let row = table[i];
    if(row.parentId===parentId){
      const obj={
        label:row.title,
        id:row.id,
      };
      const  childrenArr =f(table,row.id);
      if (childrenArr.length>0){
        obj.children=childrenArr
      }
       arr.push(obj)
    }
  };
  return arr;
};

module.exports = f;
