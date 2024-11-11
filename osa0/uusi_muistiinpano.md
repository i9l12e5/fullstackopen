```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    Note right of browser: { "note": "1234" }
    activate server
    server->>browser: HTML document
    Note right of server: Note added successfully
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server->>browser: HTML document 
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server->>browser: CSS file
    Note left of browser: .container {
                            padding: 10px;
                            border: 1px solid
                            }

                            .notes {
                            color: blue;
                            }
    Note right of server: Styling for container and notes
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server->>browser: Cached file
    Note right of server: Didn't download, used cached file instead
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server->>browser: JSON Object
    Note left of browser: 
    0	Object { content: "second note", date: "2024-11-11T17:32:05.537Z" }
    1   Object ...
    Note right of server: Data payload of last 100 notes
    deactivate server