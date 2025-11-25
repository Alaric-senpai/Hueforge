
'use server'

import { z } from "zod"

const inputmessage = z.string({
    message: 'A prompt is required '
})