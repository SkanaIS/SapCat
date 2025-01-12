/*
 * @Author: FeathLigh && zx2641213764@gmail.com
 * @Date: 2025-01-11 13:11:32
 * @LastEditors: FeathLigh && zx2641213764@gmail.com
 * @LastEditTime: 2025-01-12 00:15:54
 * @FilePath: \SapCatV2\inputProcessor.js
 * @Description: 处理输入的指令和自然语言并返回结果。
 * Copyright (c) 2025 by FeathLigh, All Rights Reserved. 
 */

import { NCWebsocket, Structs } from "node-napcat-ts"
import { music163_get } from "./api.js"
import { logger_sapcat, logger_plugin } from './logger.js'

/**
 * 获取命令结果
 * @param {} napcat 
 * @param {napcat<NCWebsocket>} NCWebsocket - napcat
 * @param {rawMessageFormat<string>} text - 格式化的原始消息（移除reply和at）
 * @param {Args<string>} textArray - 命令参数
 * @returns {Result<string>} 执行结果
 */
export async function getInputProcessResult(napcat, rawMessageFormat, args) {
    logger_plugin.debug(args)
    let processResult = null
    switch (args[0]) {
        case '/recall':
            if (args.length != 2) {
                processResult = Structs.text('参数错误。')
            } else {
                try { await napcat.delete_msg({ message_id: args[1] }) }
                catch (error) { logger_plugin.error('撤回消息时遇到错误: ' + JSON.stringify(error)) }
            }
            break;
        case '/music163':
            if (args.length != 2) {
                processResult = Structs.text('参数错误。')
            } else {
                const music163Result = await music163_get(args[1])
                logger_plugin.debug('Music163_get rawResult: ' + music163Result)//打印调试信息
                if (music163Result == null || music163Result == '') {
                    processResult = Structs.text('解析失败。')
                    break;
                }
                processResult = [Structs.image(music163Result.song_info.cover), Structs.text(`解析成功。\n` +
                    `歌曲名：${music163Result.song_info.name}\n` +
                    `艺术家：${music163Result.song_info.artist}\n` +
                    `专辑：${music163Result.song_info.album}\n` +
                    `音质：${music163Result.song_info.level}\n` +
                    `封面Url：${music163Result.song_info.cover}\n` +
                    `--------------\n` +
                    `歌曲Url：${music163Result.url_info.url}\n` +
                    `歌曲时长：${music163Result.url_info.interval}\n` +
                    `歌曲大小：${music163Result.url_info.size}\n` +
                    `歌曲格式：${music163Result.url_info.type}`)]
            }
            break;
    }
    return processResult;
}