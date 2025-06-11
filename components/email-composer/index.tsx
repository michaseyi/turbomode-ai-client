"use client"
import { BlockNoteView } from "@blocknote/mantine"
import { useCreateBlockNote } from "@blocknote/react"
import React from "react"

import "@blocknote/mantine/style.css"
import "./styles.css"

export function EmailComposer() {
	const editor = useCreateBlockNote()

	return (
		<div className="border border-border rounded-lg p-2 pb-6">
			<BlockNoteView editor={editor} data-theming-css-variables-demo />
		</div>
	)
}
