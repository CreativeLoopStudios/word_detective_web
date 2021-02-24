import { useEffect, useRef } from 'react'

export default function useFocusOnRender (initialValue) {
    const inputRef = useRef(initialValue)

    useEffect(() => {
        if (inputRef.current != null) {
            inputRef.current.focus()
        }
    }, [inputRef]);

    return inputRef
}