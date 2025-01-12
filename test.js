/*
 * @Author: FeathLigh && zx2641213764@gmail.com
 * @Date: 2025-01-11 13:28:57
 * @LastEditors: FeathLigh && zx2641213764@gmail.com
 * @LastEditTime: 2025-01-11 23:35:29
 * @FilePath: \SapCatV2\test.js
 * @Description: 
 * Copyright (c) 2025 by FeathLigh, All Rights Reserved. 
 */
import { Structs } from "node-napcat-ts";
import { music163_get } from "./api.js";

console.log(Structs.text('Hello, World!'));
const result = await music163_get('https://music.163.com/#/song?id=2085833517');
console.log({a:result.song_info.cover});