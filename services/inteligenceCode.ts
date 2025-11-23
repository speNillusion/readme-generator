export const generateReadmeFromContext = async (context: string): Promise<string> => {
  try {
    // Call the local backend proxy
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ context })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Failed to generate content: No content in response.");
    }

    // Strip markdown code fences if present
    const cleanContent = content.replace(/^```markdown\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');

    return cleanContent;

  } catch (error) {
    console.error("Error generating README:", error);
    throw error;
  }
};