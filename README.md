# AI Whiteboard

A powerful, AI-powered whiteboard application built with [tldraw](https://tldraw.com/), [React](https://react.dev/), and Google's [Gemini API](https://deepmind.google/technologies/gemini/).

This application allows you to generate diagrams, drawings, and shapes on an infinite canvas using natural language prompts or voice commands. It features a "Planning Mode" for breaking down complex tasks into executable steps.

## Features

-   **✨ AI Generation**: Turn text prompts into actual whiteboard shapes (boxes, arrows, text, notes, etc.).
-   **🧠 Planning Mode**: Handles complex requests by breaking them down into a sequence of atomic actions (e.g., "Draw a house" -> draws body, roof, door, window sequentially).
-   **mic Voice Input**: Use your microphone to dictate prompts directly to the AI.
-   **🔄 Context Awareness**: The AI understands what's currently on the canvas. You can ask it to "turn the red box blue" or "connect the two squares with an arrow".
-   **🎨 Full Tldraw Capabilities**: All the standard features of tldraw (drawing, moving, resizing, styling) are available.

## Tech Stack

-   **Framework**: React 19 + Vite
-   **Whiteboard Engine**: tldraw
-   **Styling**: Tailwind CSS
-   **AI Model**: Google Gemini 2.5 Flash
-   **Icons**: Lucide React

## Getting Started

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn
-   A Google Gemini API Key (Get one [here](https://aistudio.google.com/app/apikey))

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd whiteboard
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

## Usage

### 1. Configure API Key
Before you can generate anything, you need to set up your API key.
-   Click the **Settings** (gear) icon in the top toolbar.
-   Paste your Gemini API Key into the input field.
-   Click "Save". The key is saved locally in your browser.

### 2. Basic Generation
-   Click the **Generate** button (wand icon) to open the input bar.
-   Type a prompt, for example:
    -   "Draw a flow chart for a login process"
    -   "Create a red sticky note that says 'Urgent'"
    -   "Draw three blue circles in a row"
-   Press **Enter** or click the wand button to generate.

### 3. Voice Input
-   Click the **Microphone** icon in the input bar.
-   Speak your prompt clearly.
-   Click the microphone again to stop listening, or just press Enter to send the captured text.

### 4. Planning Mode
For more complex tasks that require multiple steps:
-   Check the **Planning** box in the input bar.
-   Enter a complex prompt, e.g., "Draw a system architecture diagram with a database, api server, and client".
-   The AI will generate a list of steps.
-   A panel will appear showing the plan. Click **Execute Plan** to watch the AI build your diagram step-by-step.

### 5. Modifying Existing Items
Select items on the canvas or refer to them by their properties:
-   "Change the color of the selected shape to green"
-   "Connect the database to the server with an arrow"
-   "Delete all the red boxes"

## License

MIT
