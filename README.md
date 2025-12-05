# StorySpark

**StorySpark** is an interactive Choose Your Own Adventure (CYOA) story builder that empowers creators to weave branching narratives with beautiful, comic-style presentations. Create interactive bedtime stories, adventures, and immersive experiences where readers make choices that shape the story's path.

## What is StorySpark?

StorySpark is a web-based platform for creating and sharing interactive stories. Whether you're crafting bedtime stories for children, educational adventures, or creative fiction, StorySpark provides an intuitive visual editor to build branching narratives where each choice leads to different outcomes.

### Key Features

- **🎨 Visual Story Builder**: Create branching narratives with an intuitive scene-based editor
- **🔄 Interactive Choices**: Add multiple choices to each scene that link to different story paths
- **🎮 Real-Time Player**: Test your stories instantly with a comic-style interactive player
- **👤 User Accounts**: Secure authentication to save and manage your stories
- **📚 Story Management**: Organize multiple stories from your personal dashboard
- **🌓 Theme Support**: Beautiful dark and light themes for comfortable editing
- **💾 Cloud Storage**: Your stories are automatically saved to the cloud

## How to Use StorySpark

### Getting Started

1. **Sign Up or Log In**
   - Visit the StorySpark homepage
   - Click "Start Creating" to create an account or log in
   - You'll need an email address to get started

2. **Create Your First Story**
   - Once logged in, you'll see your dashboard
   - Click the "Create New Story" button
   - Enter a title and starting text for your story
   - Click "Create Story" to begin

### Building Your Story

#### Adding Scenes

- **Create a Scene**: Click the "+" button in the sidebar to add a new scene
- **Edit Scene Details**:
  - Give each scene a descriptive title
  - Write the scene description (what happens in this part of the story)
  - Changes are saved automatically

#### Adding Choices

- **Add Choices**: Select a scene, then click "Add Choice" in the Scene Choices section
- **Write Choice Text**: Enter what the reader will choose (e.g., "Go through the door" or "Turn back")
- **Link to Other Scenes**: Use the dropdown to select which scene this choice leads to
  - Leave blank if this is an ending scene
  - Link to any other scene in your story to create branching paths

#### Managing Your Story

- **Select Scenes**: Click any scene in the sidebar to edit it
- **Delete Scenes**: Click "Delete Scene" to remove a scene (be careful - this can't be undone!)
- **Delete Choices**: Click the trash icon next to any choice to remove it
- **Test Your Story**: Use the Player tab to experience your story as readers will

### Playing Stories

- Switch to the **Player** view to test your interactive story
- Click through choices to navigate your branching narrative
- Use the reset button to start over
- This is how your readers will experience the story!

### Tips for Creating Great Stories

1. **Start Simple**: Begin with 3-5 scenes to get familiar with the editor
2. **Plan Your Branches**: Think about where each choice should lead before linking them
3. **Test Often**: Use the Player to make sure all your choices work correctly
4. **Create Endings**: Some scenes should have no choices (or choices that don't link anywhere) to create story endings
5. **Use Descriptive Titles**: Clear scene titles help you navigate your story structure

## Technical Details

StorySpark is built with:
- **Next.js 15** - React framework for the web application
- **TypeScript** - Type-safe development
- **Supabase** - Authentication and database backend
- **Tailwind CSS** - Modern, responsive styling
- **React 19** - Latest React features

## Project Structure

```
story-builder/
├── cyoa-wf/              # Main application directory
│   ├── src/
│   │   ├── app/          # Next.js app router pages
│   │   │   ├── auth/     # Authentication page
│   │   │   ├── dashboard/# Main dashboard and editor
│   │   │   └── stories/  # Story creation and viewing
│   │   ├── components/   # React components
│   │   │   ├── Editor.tsx    # Scene and choice editor
│   │   │   ├── Player.tsx    # Interactive story player
│   │   │   └── ...
│   │   └── lib/         # Utilities and Supabase client
│   └── package.json
└── README.md
```

## Development

To run StorySpark locally:

```bash
cd cyoa-wf
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

**Note**: You'll need to configure Supabase credentials in your environment variables for authentication and database functionality to work.

---

**Happy Storytelling!** ✨

Create, play, and share your interactive adventures with StorySpark.
