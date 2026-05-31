"use client"

import { useEffect } from "react"

export function ConsoleEasterEgg() {
    useEffect(() => {
        console.log(
            "%c  ██████╗ ██████╗  █████╗ ██╗   ██╗██╗  ██╗ ██████╗ \n" +
            "%c  ██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝██║ ██╔╝██╔═══██╗\n" +
            "%c  ██║  ██║██████╔╝███████║ ╚████╔╝ █████╔╝ ██║   ██║\n" +
            "%c  ██║  ██║██╔══██╗██╔══██║  ╚██╔╝  ██╔═██╗ ██║   ██║\n" +
            "%c  ██████╔╝██║  ██║██║  ██║   ██║   ██║  ██╗╚██████╔╝\n" +
            "%c  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ \n" +
            "%c\n" +
            "%c  🚀 Creative Developer & Designer\n" +
            "%c  📧 hello@drayko.xyz\n" +
            "%c  🐙 github.com/ddrayko\n",
            "color: #6C8CFF; font-weight: bold; font-size: 12px;",
            "color: #6C8CFF; font-weight: bold; font-size: 12px;",
            "color: #8CA8FF; font-weight: bold; font-size: 12px;",
            "color: #8CA8FF; font-weight: bold; font-size: 12px;",
            "color: #A8C0FF; font-weight: bold; font-size: 12px;",
            "color: #A8C0FF; font-weight: bold; font-size: 12px;",
            "color: transparent; font-size: 6px;",
            "color: #6C8CFF; font-weight: bold; font-size: 14px;",
            "color: #8CA8FF; font-size: 12px;",
            "color: #A8C0FF; font-size: 12px;"
        )
    }, [])

    return null
}
