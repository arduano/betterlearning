export interface PageData {
    type: 'html',
    id: string,
    name: string,
    data: HTMLPageData
}

export interface HTMLPageData {
    html: string
}