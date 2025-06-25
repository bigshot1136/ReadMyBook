# Custom Story Generation Troubleshooting Guide

## Issue: Custom Stories Not Generating

The custom story generation feature uses Google's Gemini AI API to create personalized children's stories. If stories aren't generating, here are the troubleshooting steps:

## Step 1: Check API Key Configuration

**Problem**: The Gemini API key is not properly configured.

**Solution**: 
1. Go to your Replit project
2. Click on "Secrets" tab in the left sidebar  
3. Add a new secret with:
   - Key: `GEMINI_API_KEY`
   - Value: ``
4. Save the secret
5. Restart the application

## Step 2: Verify API Key is Working

**Check the console logs**:
- You should see "Gemini API Key available: true" when the server starts
- If you see "false", the API key is not being loaded

## Step 3: Test Story Creation Process

**Frontend Issues**:
1. Open browser developer tools (F12)
2. Go to Network tab
3. Try creating a custom story
4. Check for any failed network requests
5. Look for console errors

**Backend Issues**:
1. Check the Replit console for error messages
2. Look for these specific log messages:
   - "Received custom story request"
   - "Starting story generation with request"
   - "Sending request to Gemini API"
   - "Story generation completed successfully"

## Step 4: Common Error Messages

### "Empty response from Gemini"
- **Cause**: API key invalid or rate limits exceeded
- **Solution**: Verify API key is correct and active

### "Failed to create custom story"
- **Cause**: Various issues in the generation pipeline
- **Solution**: Check console logs for specific error details

### "Invalid request data"
- **Cause**: Form validation failed
- **Solution**: Ensure all required fields are filled:
  - Title (not empty)
  - Genre (selected)
  - Age Group (selected)
  - Page Count (between 1-50)
  - At least one character name
  - Theme (not empty)

## Step 5: Manual Testing

You can test the API directly using curl:

```bash
curl -X POST http://localhost:5000/api/stories/custom \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Story",
    "genre": "Fantasy",
    "ageGroup": "4-8",
    "pageCount": 12,
    "characterNames": ["Alice", "Bob"],
    "theme": "friendship"
  }'
```

## Step 6: Check Database Connection

Stories are saved to the database after generation. Verify:
1. Database is connected properly
2. Stories table exists
3. User is authenticated

## Step 7: Form Validation Issues

**Required Fields**:
- Title: Must not be empty
- Genre: Must be selected from dropdown
- Age Group: Must be selected from dropdown  
- Page Count: Must be between 1-50
- Character Names: At least one non-empty name
- Theme: Must not be empty

**Optional Fields**:
- Character Photos: Can be empty
- Additional character names: Can be empty

## Step 8: API Rate Limits

Gemini API has rate limits:
- If you're hitting limits, you'll see specific error messages
- Wait a few minutes before trying again
- Consider upgrading your Gemini API plan if needed

## Step 9: Network Issues

**Check Connectivity**:
1. Verify Replit can access external APIs
2. Check for any firewall or network restrictions
3. Try accessing Google AI Studio directly

## Step 10: Debugging Mode

To enable more detailed logging:

1. The application already has comprehensive logging enabled
2. Check both browser console and Replit console
3. Look for the complete error stack trace

## Expected Workflow

**Successful Story Creation**:
1. User fills form and submits
2. Frontend validates data and sends to `/api/stories/custom`
3. Backend receives request and validates schema
4. Backend calls Gemini API with story parameters
5. Gemini generates story content and illustration prompts
6. Backend saves story to database
7. Frontend receives success response and displays confirmation
8. User can view the story in their story list

## Getting Help

If none of these steps resolve the issue:
1. Check the Replit console for complete error logs
2. Verify all environment variables are set correctly
3. Test with simpler story parameters first
4. Contact support with specific error messages from logs

The custom story generation system is now properly configured and should work correctly once the API key is properly set in Replit secrets.
