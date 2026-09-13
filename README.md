# CodeSaathi

CodeSaathi is a multi-language code execution API designed to execute untrusted programs in isolated Docker environments while applying lightweight source-level optimizations.

## What it does

CodeSaathi provides an execution layer for programs written in multiple languages. The architecture separates language handling, source preprocessing, execution, and isolation so the system can be extended without coupling every language to the API layer.

## Features

- Python, C, C++, Java, JavaScript, and Swift support
- Docker-based execution isolation
- AST-based comment stripping where applicable
- Source/code preprocessing before execution
- Environment-based configuration
- Modular execution architecture
- VS Code debugging configuration

## Architecture

```text
Client
  ↓
Execution API
  ↓
Language / preprocessing layer
  ↓
Isolated Docker container
  ↓
Execution result
```

The Docker boundary is the primary isolation mechanism. The application should be treated as an execution service rather than as a general-purpose shell.

## Tech Stack

- JavaScript / Node.js
- Docker
- AST-based source processing
- Multi-language compiler/runtime environments

## Setup

### Prerequisites

- Node.js
- Docker Desktop or Docker Engine
- A running Docker daemon

### Run

```bash
npm install
```

Configure the required environment variables for the local setup, then start the application using the repository's development command.

## Security Notes

Code execution systems require defense in depth. Container isolation should be combined with resource limits, restricted networking, filesystem controls, timeouts, and careful validation of user input before production deployment.

## Project Status

**Active prototype.** The core execution and isolation architecture is in place and can be extended toward a production-grade online judge or code-execution backend.
