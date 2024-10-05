# File Storage Service

A basic Node.js service to upload and store files, with daily archiving.

## Features

- **Upload Files**: Users can upload files.
- **Daily Archives**: Files are archived every day automatically.

## Setup

### Requirements

- **Node.js** (v14 or higher)
- **npm**

### Installation

1. **Clone the repository**:

   ```sh
   git clone <repository-url>
   cd file-storage
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

### Run the Server

- **Development Mode**:

  ```sh
  npm run dev
  ```

- **Production Mode**:

  ```sh
  npm start

  # Running Container

  sudo docker run -d -p 3000:3000 -e GITHUB_TOKEN=<token> -v uploaded_files_volume:/app/src/uploaded-files sgospodinov02/file-storage
  ```

````

### Upload Files

- **Endpoint**: `/upload`
- **Method**: `POST`
- **Usage**: Use the field name `file` to upload.

Example:

```sh
curl -F "file=@path/to/your/file.txt" http://localhost:3000/upload
````

### Archives

- Files are automatically archived once per day.
- Archives are saved as `.zip` in the `archives` folder.
