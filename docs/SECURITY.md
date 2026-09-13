# Security Notes

CodeSaathi executes submitted code and therefore treats execution as an untrusted-input problem.

## Current approach

- Request parsing is separated from execution logic.
- Docker is intended to provide process isolation for executed programs.
- Environment configuration belongs in `.env` and is excluded from version control.
- The API should validate supported languages and reject malformed execution requests.

## Prototype limitations

This project is an educational/prototype code-execution service. Container isolation, resource limits, filesystem restrictions, network policy, and production hardening should be independently reviewed before exposing it to untrusted users.