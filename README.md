##Dynamic Table Server
Dynamic Table Server is a project that dynamically loads data from the server in limited amounts. As the user scrolls, additional data is fetched from the bottom, and excess data is removed from the top, ensuring the interface is not overloaded. The project also includes sorting, basic search (currently in progress for full multilingual support), and functionalities for modifying, deleting, and adding documents from the client. File locking (to prevent editing the same document by multiple users simultaneously) is planned for future updates.

##Features
 -Dynamic Data Loading: Loads data in small chunks, with additional data fetching as the user scrolls. 
 
 -Sorting: Allows sorting by different table columns.
 
 -Basic Search: Includes search functionality (still in progress with multi-language support).
 
 -Document Operations: Modify, delete, and add documents directly from the client-side.
 
 -Real-Time Document Interaction: Allows the client and server to interact in real-time.
 
 -Future Features: Planned implementation of file locking for simultaneous document editing.

##Project Structure
 -The project consists of two main parts, which are run together using concurrently:

1.Express: The backend service that handles database operations and API requests.
2.Next.js: The frontend service that displays and interacts with the data.

##Installation and Setup
Prerequisites
-Node.js version 18.x or higher.
-MySQL (or compatible database) for storing documents.

##Clone the Repository

Clone the repository to your local machine:

    bash
    git clone git@github.com:RomanLavrunov/dynamic_table.git
    cd dynamic_table_server
    Install Dependencies

For Express (backend):

    bash
    cd express
    npm install     

For Next.js (frontend):

    bash
    
    cd next
    npm install

If you're using Docker, make sure Docker is installed and proceed with the steps below.

##Running Without Docker

You can run the project without Docker using concurrently. From the root folder of the project:

1.Start both the Express server and Next.js frontend:

    bash
    npm start

This will run the Express server on port 4000 and the Next.js frontend on port 3000.

2.Open your browser:

    API server: http://localhost:4000
    Frontend: http://localhost:3000

##Running With Docker
If you prefer to use Docker, the project is configured for it. Follow these steps:

Build the Docker containers:

    bash

    docker-compose up --build
After building the images, your services will be available through Docker:

-API server: http://localhost:4000
-Frontend: http://localhost:3000

##Database Setup
The project uses MySQL to store documents. To create the necessary database table, run the migration:

Navigate to the Express directory:

    bash

    cd express
    Run the migration to set up the database schema:

    bash

    npm run migrate:latest
    This will create the documents table in your MySQL database.

##Database Schema
The schema for the documents table is as follows:

Database Schema
Table: documents

id: Integer // Unique identifier for the document // Primary Key, Auto-incremented

state: String // The status of the document // Indexed for faster querying

stateTime: Timestamp // The time when the status of the document was last updated.

documentNumber: String // Unique document number // Unique index

documentName: String // The name of the document

documentDate: Date // The date of the document

documentTotalAmount: Float // The total amount for the document

eligibleAmount: Float // The eligible amount related to the document

version: Integer // The version number of the document

eligiblePercentage: Decimal(5, 2) // The eligible percentage (e.g., 95.00) // Can be NULL

created_at: Timestamp // The date and time when the document was created // Automatically set (true, true)

updated_at: Timestamp // The date and time when the document was last updated // Automatically updated (true, true)

##Development and Testing
In previous iterations of the project, test cases were implemented, but there are no tests in the current version of the project. However, the code can easily be extended to include tests in future releases.

##License
This project does not currently have a license. If you would like to include a license, consider using an open-source license like MIT. You can generate one using online tools such as choosealicense.com.

##Additional Information
-Docker Configuration: Docker configuration is included in the project, but it may require adjustments based on your environment and requirements.

-Database Setup: Make sure that your MySQL server is properly set up and configured for the project. You may need to adjust environment variables for database access.

-Future Updates: File locking functionality for preventing simultaneous document editing is planned for future releases.

##How to run both the backend (Express) and frontend (Next.js) using concurrently
The project uses concurrently to run both the backend and frontend together. To start both services, simply run:

bash

npm start
This will start the backend on port 4000 and the frontend on port 3000.
