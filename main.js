/*
 * @Author: FeathLigh && zx2641213764@gmail.com
 * @Date: 2025-01-11 10:40:05
 * @LastEditors: FeathLigh && zx2641213764@gmail.com
 * @LastEditTime: 2025-01-12 13:50:26
 * @FilePath: \SapCatV2\main.js
 * @Description: SapCat执行入口。
 * Copyright (c) 2025 by FeathLigh, All Rights Reserved. 
 */
import { logger_sapcat, logger_plugin } from './logger.js'

import { Structs } from 'node-napcat-ts'
import { NCWebsocket } from 'node-napcat-ts'
const napcat = new NCWebsocket({
    baseUrl: 'ws://127.0.0.1:1314',
    accessToken: 'love',
    throwPromise: true,
    //自动重连
    reconnection: { enable: true, attempts: 10, delay: 5000 }
    //👇DEBUG 模式
}, true)

import { getInputProcessResult } from './inputProcessor.js'


napcat.on('message', async (context) => {
    if (context.message_type == 'private') {
        logger_sapcat.info(`📣 私聊消息 # ${context.sender.nickname}(${context.sender.user_id}) : ${context.raw_message}`)
    } else {
        try {
            const groupInfo = await napcat.get_group_info({ group_id: context.group_id })
            logger_sapcat.info(`📣 群聊消息 # ${context.sender.nickname}(${context.sender.user_id}) -> ${groupInfo.group_name}(${context.group_id}) : ${context.raw_message}`);
        } catch (error) {
            logger_sapcat.error(error)
        }
    }

    //匹配开头的reply应对为某条消息执行指令的情况
    //example:[CQ:reply,id=MessageID][CQ:at,qq=UserID] /recall => [CQ:at,qq=UserID] /recall MessageID
    let raw_messageFormat = context.raw_message
    if (/^\[CQ:reply,id=[\s\S]*]*/.test(raw_messageFormat)) {
        const match = /\[CQ:reply,id=(.*?)\].*?/.exec(raw_messageFormat)
        raw_messageFormat = raw_messageFormat.replace(match[0], '') + ' ' + match[1]
    }
    //匹配开头是否包含at并移除(群聊内)
    if (context.message_type == 'group') {
        if (raw_messageFormat.substring(0, '[CQ:at,qq=3636990074] '.length) != '[CQ:at,qq=3636990074] ') { return; }
        raw_messageFormat = raw_messageFormat.substring('[CQ:at,qq=3636990074] '.length)
    }
    const raw_messageSplit = raw_messageFormat.split(' ')

    const processResult = await getInputProcessResult(napcat, raw_messageFormat, raw_messageSplit)//获取输入内容的处理结果
    if (processResult == null) {return;}
    
    logger_plugin.info(`✨ 指令执行 # ${raw_messageSplit[0]} => ${JSON.stringify(processResult)}`)
    if (context.message_type == 'private') {
        try{await napcat.send_msg({ user_id: context.sender.user_id, message: processResult })
        }catch (error) {logger_plugin.error(error)}
        
    } else {
        console.log([...[Structs.reply({ id: context.message_id })], ...processResult])
        try {await napcat.send_msg({ group_id: context.group_id, message: [...[Structs.reply({ id: context.message_id })], ...processResult] })
        } catch (error) {logger_plugin.error(error)}
    }
})
logger_sapcat.info('🔗 连接到 ws://Feath_Dev.local:1314?access_token=love')
await napcat.connect()