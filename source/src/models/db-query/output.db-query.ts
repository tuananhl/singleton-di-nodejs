export interface OutputDbQuery<T> {
    ['rows']: Array<T>,
    ['fields']: any
}