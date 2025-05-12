# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

This project uses Genkit with the Google AI plugin, which requires a Google AI API key.

1.  **Obtain an API Key:**
    Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create and obtain your API key.

2.  **Set up your environment variables:**
    Create a `.env` file in the root of your project (if it doesn't already exist) and add your API key:

    ```env
    GOOGLE_API_KEY="YOUR_API_KEY_HERE"
    ```

    Replace `"YOUR_API_KEY_HERE"` with the actual API key you obtained.

## Running the Application

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run the Genkit development server (for AI flows):
    ```bash
    npm run genkit:watch
    ```

3.  In a separate terminal, run the Next.js development server:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.
The Genkit developer UI will be available at `http://localhost:4000`.
