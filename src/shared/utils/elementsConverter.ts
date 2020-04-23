
export function entityJsonToHtml(entity: JSON): String {
    return ""//TODO

}

export function entityHtmlToJson(entity: string): {}{//TODO TYPAGE
    const xmlEntity = new DOMParser().parseFromString(entity,"text/html");
    return {}//TODO
}