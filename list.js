const { promiseImpl } = require('ejs');
const fetch = require('node-fetch');


const getGitUsername = ()=>{


  const URL = 'https://map.yahooapis.jp/search/local/V1/localSearch?&output=json&detail=full&appid=dj00aiZpPXBWaXBPSnNJek11ViZzPWNvbnN1bWVyc2VjcmV0Jng9YWU-&results=10&query=osaka';
  
  fetch(URL)
  .then(res => {
    if (!res.ok) {
      // 200 系以外のレスポンスはエラーとして処理
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  })

  // これがレスポンス本文のテキスト
  .then(json => {
    console.log(json),
    all_name = json.Feature.filter(function(item, index){
      return true;
    });

    for(var i=0; i<all_name.length; i++){
      console.log(all_name[i].Name)
    }
    
    return all_name;
    
    
  })
 
  // エラーはここでまとめて処理
  .catch(err => console.error(err));
};





const name = getGitUsername();
console.log(name);


