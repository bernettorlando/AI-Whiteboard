import { useState, useCallback } from 'react'
import { useEditor, createShapeId } from 'tldraw'

export function useMakeReal() {
    const editor = useEditor()
    const [isLoading, setIsLoading] = useState(false)

    const makeReal = useCallback(async (prompt: string) => {
        const apiKey = localStorage.getItem('gemini_api_key')
        if (!apiKey) {
            alert('Please set your Gemini API key in settings first.')
            return
        }

        setIsLoading(true)
        try {
            const currentShapes = editor.getCurrentPageShapes()
            const currentShapesJson = JSON.stringify(currentShapes)
            const { x: centerX, y: centerY } = editor.getViewportPageBounds().center
            const selectedShapeIds = editor.getSelectedShapeIds()
            const selectedShapeIdsJson = JSON.stringify(selectedShapeIds)

            const systemPrompt = `You are an expert at generating tldraw shapes.
			You will receive a user prompt and a JSON list of CURRENT SHAPES on the canvas.
            You will also receive the current VIEWPORT CENTER (x, y).
            You will also receive a list of SELECTED SHAPES IDs.

			YOUR GOAL:
			- If the user asks to MODIFY existing shapes, you MUST return the shape with the SAME "id" and the updated properties.
            - If the user has SELECTED shapes (provided in the SELECTED SHAPES IDs list), the prompt applies to those shapes. You should modify them or use them as context.
			- If the user asks to CREATE new shapes, generate a new unique "id" (e.g. "shape:new-1") or just leave it matching the format.
            - If the user does NOT specify a location, place new shapes near the VIEWPORT CENTER: x=${centerX}, y=${centerY}.
            - If the user specifies a relative location (e.g. "above the red box"), calculate the absolute coordinates based on the target shape's position.
            - To DELETE shapes, return a "delete" property with a list of shape IDs to remove.
            - To update a shape, you must include its "id" and "type" and the "props" you want to change. You can include the full shape object.
            - To SELECT shapes, return a "selection" property with a list of shape IDs.

			IMPORTANT SCHEMA RULES:
			- "text", "note", and "geo" shapes do NOT use a "text" property. They use "richText".
            - "richText" MUST be a JSON object following the TipTap/Prosemirror schema:
              {
                "type": "doc",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      {
                        "type": "text",
                        "text": "Your text here"
                      }
                    ]
                  }
                ]
              }
			- For "text" shapes, the "size" prop MUST be one of: "s", "m", "l", "xl".
			- For "geo" shapes, "color" must be one of: "black", "grey", "light-violet", "violet", "blue", "light-blue", "yellow", "orange", "green", "light-green", "red", "light-red".
            - For "geo" shapes, "fill" must be one of: "none", "semi", "solid", "pattern".
            - IMPORTANT: "color" sets the stroke/text color. "fill" sets the fill style. To change the fill color, you must change the "color" prop.
			- For "arrow" shapes, you MUST include "start" and "end" props, each with "x" and "y" coordinates.
            - For "arrow" shapes, do NOT include "align", "verticalAlign", "size", or "geo" properties.
            - "arrow" shapes only support: "start", "end", "color", "labelColor", "bend", "arrowheadStart", "arrowheadEnd".
            - For "note" shapes:
                - Support "color", "size", "font", "align", "verticalAlign", "growY", "url".
                - "color" options: "black", "grey", "light-violet", "violet", "blue", "light-blue", "yellow", "orange", "green", "light-green", "red", "light-red".
            - For "frame" shapes:
                - Support "w" (width), "h" (height), "name" (string).
                - Do NOT use "text" or "richText" for frames. Use "name".
			
			Example response format:
			{
				"shapes": [
					{
						"id": "shape:existing-id",
						"type": "geo",
						"x": 0,
						"y": 0,
						"props": { 
                            "w": 100, 
                            "h": 100, 
                            "geo": "rectangle", 
                            "color": "red",
                            "fill": "solid",
                            "richText": {
                                "type": "doc",
                                "content": [
                                    {
                                        "type": "paragraph",
                                        "content": [{ "type": "text", "text": "Box Label" }]
                                    }
                                ]
                            }
                        }
					}
				],
                "delete": ["shape:id-to-delete"],
                "selection": ["shape:existing-id"]
			}

			Return ONLY the JSON. Do not include markdown formatting.`

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: systemPrompt + "\n\nCURRENT SHAPES JSON:\n" + currentShapesJson + "\n\nSELECTED SHAPES IDS:\n" + selectedShapeIdsJson + "\n\nUser Prompt: " + prompt }]
                    }],
                    generationConfig: {
                        response_mime_type: "application/json"
                    }
                })
            })

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`)
            }

            const data = await response.json()
            const textContent = data.candidates[0].content.parts[0].text
            const content = JSON.parse(textContent)

            if (content.shapes && Array.isArray(content.shapes)) {

                const shapesToCreate: any[] = []
                const shapesToUpdate: any[] = []

                content.shapes.forEach((s: any) => {
                    const existingShape = editor.getShape(s.id)
                    if (existingShape) {
                        // Update existing shape
                        shapesToUpdate.push({
                            ...s,
                            id: existingShape.id, // Ensure ID matches
                        })
                    } else {
                        // Create new shape
                        shapesToCreate.push({
                            ...s,
                            id: createShapeId(), // Generate valid ID for new ones
                            x: s.x || centerX,
                            y: s.y || centerY,
                        })
                    }
                })

                if (shapesToCreate.length > 0) {
                    editor.createShapes(shapesToCreate)
                }
                if (shapesToUpdate.length > 0) {
                    editor.updateShapes(shapesToUpdate)
                }
            }

            if (content.delete && Array.isArray(content.delete)) {
                editor.deleteShapes(content.delete)
            }

            if (content.selection && Array.isArray(content.selection)) {
                editor.select(...content.selection)
            }

        } catch (error) {
            console.error('Error generating:', error)
            alert('Failed to generate. Check console for details.')
        } finally {
            setIsLoading(false)
        }
    }, [editor])

    const generatePlan = useCallback(async (prompt: string): Promise<string[]> => {
        const apiKey = localStorage.getItem('gemini_api_key')
        if (!apiKey) {
            alert('Please set your Gemini API key in settings first.')
            return []
        }

        setIsLoading(true)
        try {
            const systemPrompt = `You are an expert at breaking down complex drawing tasks into simple, sequential steps for a whiteboard AI.
            
            YOUR GOAL:
            - Receive a complex user prompt (e.g. "Draw a house with a door and window and a sun").
            - Break it down into a list of VERY SIMPLE, ATOMIC instructions.
            - Each instruction should be a single action that can be executed by a "dumb" AI that only knows how to draw basic shapes or move things.
            - The instructions should be sequential.
            
            EXAMPLES:
            User: "Draw a house with a door and window"
            Output: [
                "Draw a large square for the house body",
                "Draw a triangle on top of the square for the roof",
                "Draw a small rectangle at the bottom of the house for the door",
                "Draw a small square on the house for the window"
            ]

            User: "Move the red box to the right and make it blue"
            Output: [
                "Select the red box",
                "Move the selected box to the right",
                "Change the color of the selected box to blue"
            ]

            RETURN ONLY A JSON ARRAY OF STRINGS. NO MARKDOWN.`

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: systemPrompt + "\n\nUser Prompt: " + prompt }]
                    }],
                    generationConfig: {
                        response_mime_type: "application/json"
                    }
                })
            })

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`)
            }

            const data = await response.json()
            const textContent = data.candidates[0].content.parts[0].text
            console.log('AI Plan Response:', textContent)
            const steps = JSON.parse(textContent)

            if (Array.isArray(steps)) {
                return steps
            }
            return []

        } catch (error) {
            console.error('Error generating plan:', error)
            alert('Failed to generate plan. Check console for details.')
            return []
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { makeReal, generatePlan, isLoading }
}
