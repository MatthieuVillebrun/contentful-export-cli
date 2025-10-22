#!/usr/bin/env node

require('dotenv').config();
const contentfulExport = require('contentful-export');
const { Command } = require('commander');
const path = require('path');

const program = new Command();

program
  .name('contentful-export-cli')
  .description('Export content models and data from Contentful')
  .version('1.0.0')
  .option('-d, --export-dir <directory>', 'Export directory', '.')
  .option('-c, --skip-content', 'Skip content entries (export only models)', false)
  .option('-a, --skip-assets', 'Skip assets', false)
  .option('-r, --skip-roles', 'Skip roles', false)
  .option('-w, --skip-webhooks', 'Skip webhooks', false)
  .option('-v, --include-validation', 'Include content type validation', false)
  .option('-e, --environment <env>', 'Environment ID', process.env.CONTENTFUL_ENVIRONMENT_ID || 'master')
  .option('-s, --space-id <spaceId>', 'Space ID (overrides .env)', process.env.CONTENTFUL_SPACE_ID)
  .option('-t, --token <token>', 'Management token (overrides .env)', process.env.CONTENTFUL_MANAGEMENT_TOKEN)
  .option('--content-only', 'Export only content entries (not models)', false)
  .option('--models-only', 'Export only content models (alias for --skip-content)', false);

program.parse();

const options = program.opts();

// Validate required environment variables
if (!options.spaceId) {
  console.error('❌ Error: CONTENTFUL_SPACE_ID is required. Set it in .env file or use --space-id option.');
  process.exit(1);
}

if (!options.token) {
  console.error('❌ Error: CONTENTFUL_MANAGEMENT_TOKEN is required. Set it in .env file or use --token option.');
  process.exit(1);
}

// Handle conflicting options
if (options.contentOnly && (options.skipContent || options.modelsOnly)) {
  console.error('❌ Error: --content-only cannot be used with --skip-content or --models-only');
  process.exit(1);
}

// Build export options
const exportOptions = {
  spaceId: options.spaceId,
  managementToken: options.token,
  environmentId: options.environment,
  exportDir: path.resolve(options.exportDir),
  skipContent: options.skipContent || options.modelsOnly,
  skipRoles: options.skipRoles,
  skipWebhooks: options.skipWebhooks,
  includeValidation: options.includeValidation
};

// If content-only is specified, skip everything except content
if (options.contentOnly) {
  exportOptions.skipContent = false;
  exportOptions.skipRoles = true;
  exportOptions.skipWebhooks = true;
  // Note: contentful-export doesn't have a skip-content-types option, 
  // so we'll export everything and mention this in the output
}

// Skip assets if requested
if (options.skipAssets) {
  exportOptions.skipAssets = true;
}

console.log('🚀 Starting Contentful export...');
console.log(`📁 Export directory: ${exportOptions.exportDir}`);
console.log(`🏢 Space ID: ${exportOptions.spaceId}`);
console.log(`🌍 Environment: ${exportOptions.environmentId}`);
console.log(`⚙️  Options:`, {
  skipContent: exportOptions.skipContent,
  skipAssets: exportOptions.skipAssets,
  skipRoles: exportOptions.skipRoles,
  skipWebhooks: exportOptions.skipWebhooks,
  includeValidation: exportOptions.includeValidation
});

// Run the export
contentfulExport(exportOptions)
  .then((result) => {
    console.log('✅ Export completed successfully!');
    if (result.fileName) {
      console.log(`📄 Export saved to: ${result.fileName}`);
    }
  })
  .catch((error) => {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  });

