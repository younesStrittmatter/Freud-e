import {writeId, writeData} from "./js/io";
import {randomId} from "./js/util"





let id = randomId();

writeId(id);

let data = {i: 'a', e: 'b'}

writeData(id, data)
