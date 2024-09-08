<div align="center">
  <img src="./logo.svg" alt="Logo Omi3"/>

  <img src="https://img.shields.io/github/actions/workflow/status/xyhomi3/omi3/build.yml?branch=main&label=build" alt="Build Status"/>
  <img src="https://img.shields.io/github/actions/workflow/status/xyhomi3/omi3/test.yml?branch=main&label=test" alt="Test"/>
  <img src="https://img.shields.io/github/repo-size/xyhomi3/omi3" alt="Repo Size"/>
</div>

---

# Dev Branch

`Omi3` is an open-source project focused on building audio processing and playback capabilities for web applications.

## Project Overview

`Omi3` aims to provide developers with a comprehensive set of tools and components for handling audio in web applications. From low-level audio processing to high-level UI components, Omi3 covers a wide range of audio-related functionalities.

### Key Features

- Audio processing and manipulation
- Customizable audio playback controls

## Project Structure

The project is organized as follows:

```
.
├── apps/ # Main applications
│   └── site/ # Main website and demo
├── packages/ # Shared packages
│   ├── audio/ # Core audio processing library
│   ├── ui/ # Reusable UI components
│   └── utils/ # Utility functions
└── tools/ # Development tools and configurations
    ├── eslint/ # ESLint configuration
    ├── tailwind/ # Tailwind CSS configuration
    ├── tsup/ # tsup configuration
    └── typescript/ # TypeScript configurations
```

## Getting Started

1. Ensure you have `Node.js (>=18)` and `pnpm` installed.
2. Clone the repository.
3. Install dependencies:
   ```
   pnpm install
   ```
4. Start the development server:
   ```
   pnpm dev
   ```

## Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get involved.

## License

`Omi3` is open-source software licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for more details.
