/*
 * @Author: FeathLigh && zx2641213764@gmail.com
 * @Date: 2025-01-11 17:23:20
 * @LastEditors: FeathLigh && zx2641213764@gmail.com
 * @LastEditTime: 2025-01-11 17:24:47
 * @FilePath: \SapCatV2\logger.js
 * @Description: 日志记录器。
 * Copyright (c) 2025 by FeathLigh, All Rights Reserved. 
 */
import log4js from 'log4js';
log4js.configure({
    appenders: {
        console: { type: "console" },
        file: {
            type: "file",
            filename: "logs/SapCat.log",
            maxLogSize: 1024 * 1024 * 12
        }
    },
    categories: { default: { appenders: ["console", "file"], level: "debug" } }
});
var logger_sapcat = log4js.getLogger('SapCat');
var logger_plugin = log4js.getLogger('Plugin');
export { logger_sapcat, logger_plugin };