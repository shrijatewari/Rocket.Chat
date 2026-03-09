---
'@rocket.chat/fuselage-ui-kit': patch
---

Fix runtime crash in VideoConferenceBlock when clicking the discussion button. The handler was accessing data before it was available, causing "Cannot read property 'discussionRid' of undefined" errors.
