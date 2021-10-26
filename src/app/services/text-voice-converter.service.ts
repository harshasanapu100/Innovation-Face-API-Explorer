import { Injectable } from "@angular/core";

import Speech from 'speak-tts';

@Injectable()
export class TextVoiceConverterService {


 // Speech Data
   speech: any;
   speechData: any;

    constructor(){
        this.speechInitialize();
    }

    speechInitialize(){

        this.speech = new Speech() // will throw an exception if not browser supported
        if(this.speech .hasBrowserSupport()) { // returns a boolean
            console.log("speech synthesis supported")
            this.speech.init({
                    'volume': 1,
                    'lang': 'en-GB',
                    'rate': 1,
                    'pitch': 1,
                    'voice':'Google UK English Male',
                    'splitSentences': true,
                    'listeners': {
                        'onvoiceschanged': (voices) => {
                            console.log("Event voiceschanged", voices)
                        }
                    }
            }).then((data) => {
                // The "data" object contains the list of available voices and the voice synthesis params
                console.log("Speech is ready, voices are available", data)
                this.speechData = data;
                data.voices.forEach(voice => {
                console.log(voice.name + " "+ voice.lang)
                });
            }).catch(e => {
                console.error("An error occured while initializing : ", e)
            })
        }
    
    }
    
    start(message){
      // Retrieve the text property of the element (cross-browser support)
        this.speech.speak({
            text: message,
        }).then(() => {
            console.log("Success !")
        }).catch(e => {
            console.error("An error occurred :", e) 
        })
    }

    pause(){
        this.speech.pause();
      }
      resume(){
        this.speech.resume();
      }
}