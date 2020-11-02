import { Language } from "../models/langauge.model";

export class Helper{

  static resolveLanguagesResult(result:Language[], model_lang:Language[]){
    result.forEach(val => {
      var lang = new Language();
      lang.id = val.id;
      lang.languageName = val.languageName;
      model_lang.push(lang);
    });
  }
}
