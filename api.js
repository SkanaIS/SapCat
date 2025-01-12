/*
 * @Author: FeathLigh && zx2641213764@gmail.com
 * @Date: 2025-01-11 16:10:25
 * @LastEditors: FeathLigh && zx2641213764@gmail.com
 * @LastEditTime: 2025-01-12 00:15:16
 * @FilePath: \SapCatV2\Api.js
 * @Description: Api接口。
 * Copyright (c) 2025 by FeathLigh, All Rights Reserved. 
 */
import axios from 'axios';

//获取网易云音乐信息
export async function music163_get(musicUri) {
    let json = { url: '', level: 'jymaster', type: 'song', token: '72a12ef74ea18f78d5c09d6f3198233e' };

    //判断是否为ID
    if (/^\d+$/.test(musicUri)) {
        json.url = `https://music.163.com/#/song?id=${musicUri}`;
    }
    else { json.url = musicUri; }

    try {
        const response = await axios.post('https://api.toubiec.cn/api/music_v1.php', json, {
            headers: { 'Authorization': 'Bearer 5f6fc885add41e528f912054ea67c496' }});
        console.log(response.status)
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

