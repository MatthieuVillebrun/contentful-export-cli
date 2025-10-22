# Contentful Export CLI

A command-line tool to export content models and data from Contentful spaces.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your Contentful credentials:
   ```env
   CONTENTFUL_SPACE_ID=your_space_id_here
   CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here
   CONTENTFUL_ENVIRONMENT_ID=master
   ```

## Usage

### Basic Usage

```bash
# Export everything (models + content)
node index.js

# Or use npm scripts
npm run export
```

### Export Options

```bash
# Export only content models (no content entries)
node index.js --models-only
npm run export:models

# Export only content entries (no models)
node index.js --content-only
npm run export:content

# Custom export directory
node index.js --export-dir ./my-exports

# Include validation rules in content models
node index.js --models-only --include-validation

# Skip specific data types
node index.js --skip-assets --skip-webhooks --skip-roles

# Use different environment
node index.js --environment staging

# Override credentials via command line
node index.js --space-id abc123 --token CFPAT-xyz
```

### Available Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--export-dir` | `-d` | Export directory | `./export` |
| `--models-only` | | Export only content models | `false` |
| `--content-only` | | Export only content entries | `false` |
| `--skip-content` | `-c` | Skip content entries | `false` |
| `--skip-assets` | `-a` | Skip assets | `false` |
| `--skip-roles` | `-r` | Skip roles | `false` |
| `--skip-webhooks` | `-w` | Skip webhooks | `false` |
| `--include-validation` | `-v` | Include content type validation | `false` |
| `--environment` | `-e` | Environment ID | `master` |
| `--space-id` | `-s` | Space ID (overrides .env) | From `.env` |
| `--token` | `-t` | Management token (overrides .env) | From `.env` |
| `--help` | `-h` | Show help | |
| `--version` | `-V` | Show version | |

## Examples

### Export only content models with validation
```bash
node index.js --models-only --include-validation
```

### Export to specific directory without assets and webhooks
```bash
node index.js --export-dir ./backups --skip-assets --skip-webhooks
```

### Export from staging environment
```bash
node index.js --environment staging --models-only
```

### Use different credentials temporarily
```bash
node index.js --space-id different-space --token CFPAT-different-token
```

## Output

The tool will create timestamped JSON files in your export directory:
- `contentful-export-{spaceId}-{environment}-{timestamp}.json`

## Security

- Never commit your `.env` file to version control
- The `.env` file is already included in `.gitignore`
- Use the `.env.example` file as a template for team members

## npm Scripts

- `npm run export` - Basic export
- `npm run export:models` - Export only content models
- `npm run export:content` - Export only content entries  
- `npm run help` - Show help information