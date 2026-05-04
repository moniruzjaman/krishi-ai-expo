# Krishi AI Expo - Kilo Skills

This directory contains shareable skills for the Krishi AI Expo project that can be used with Kilo CLI.

## Available Skills

1. **expo** - Expo CLI operations and common patterns
2. **supabase** - Supabase database operations and common patterns  
3. **testing** - React Native testing patterns and utilities
4. **typescript** - TypeScript best practices and linting

## How to Use

These skills are automatically available when working in this project with Kilo CLI. They provide:

- Context-aware assistance for common development tasks
- Best practices and patterns specific to this codebase
- Ready-to-use code snippets and examples
- Guidance on project-specific conventions

## Sharing Skills

To share these skills with other projects or team members:

1. Copy the `.kilo/skills` directory to another project
2. Or publish the skills to a shared location and reference them in kilo.json:
   ```json
   {
     "skills": {
       "paths": ["./path/to/shared/skills"]
     }
   }
   ```

## Skill Structure

Each skill follows this format:
- `.kilo/skills/{skill-name}/SKILL.md`
- Contains markdown with frontmatter specifying name and description
- Includes practical examples, best practices, and patterns
- Designed to be consumed by Kilo's AI assistants

## Adding New Skills

To add a new skill:
1. Create a directory under `.kilo/skills/{new-skill-name}/`
2. Add a `SKILL.md` file with proper frontmatter
3. Follow the format of existing skills
4. The skill will be automatically available

## Example Usage

When working with Kilo CLI in this project, you can ask for help with:
- "How do I save a user profile using Supabase?"
- "Show me the testing patterns for React Native components"
- "What are the TypeScript best practices for this project?"
- "How do I create an Expo development build?"

The skills will provide contextual assistance based on the patterns defined here.