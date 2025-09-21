# GitHub CI/CD Workflows

This directory contains GitHub Actions workflows for the Capital Marketplace Frontend project.

## Workflows

### 1. CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
- **Lint and Type Check**: Runs ESLint and TypeScript type checking
- **Build**: Builds the Next.js application with Turbopack
- **Test**: Runs tests (if available)
- **Security Audit**: Performs npm security audit
- **Lighthouse CI**: Runs performance audits on pull requests

**Features:**
- Node.js 20 with npm caching
- Parallel job execution for faster CI
- Build artifact upload for deployment workflows
- Security vulnerability scanning
- Performance monitoring with Lighthouse

### 2. Deploy Workflow (`deploy.yml`)

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Features:**
- Production environment protection
- Pre-deployment validation (lint, type check, build)
- Multiple deployment target examples:
  - Vercel
  - AWS S3 + CloudFront
  - Netlify
  - GitHub Pages

## Setup Instructions

### 1. Enable GitHub Actions
GitHub Actions are automatically enabled for public repositories. For private repositories, ensure Actions are enabled in repository settings.

### 2. Configure Secrets (for deployment)
Add the following secrets in your repository settings (`Settings > Secrets and variables > Actions`):

#### For Vercel Deployment:
- `VERCEL_TOKEN`: Your Vercel API token
- `ORG_ID`: Your Vercel organization ID
- `PROJECT_ID`: Your Vercel project ID

#### For AWS Deployment:
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `CLOUDFRONT_DISTRIBUTION_ID`: CloudFront distribution ID

#### For Netlify Deployment:
- `NETLIFY_AUTH_TOKEN`: Netlify personal access token
- `NETLIFY_SITE_ID`: Netlify site ID

#### For Lighthouse CI (optional):
- `LHCI_GITHUB_APP_TOKEN`: Lighthouse CI GitHub app token

### 3. Configure Deployment Target
Edit the `deploy.yml` file and uncomment the deployment section for your chosen platform. Comment out or remove the other deployment options.

### 4. Environment Protection
Set up environment protection rules in GitHub:
1. Go to `Settings > Environments`
2. Create a `production` environment
3. Add protection rules (required reviewers, wait timer, etc.)

## Workflow Customization

### Adding Tests
If you add tests to your project, update the test script in `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Custom Build Commands
Modify the build steps in the workflows if you need custom build commands or environment variables.

### Additional Checks
You can add more jobs to the CI workflow:
- Code coverage reporting
- Bundle size analysis
- Accessibility testing
- Cross-browser testing

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Node.js version compatibility and dependency issues
2. **Lint Errors**: Ensure ESLint configuration is correct
3. **Type Errors**: Verify TypeScript configuration
4. **Deployment Issues**: Check secrets and environment variables

### Debugging
- Check workflow logs in the Actions tab
- Use `act` to run workflows locally for testing
- Enable debug logging by adding `ACTIONS_STEP_DEBUG: true` to repository secrets

## Contributing

When contributing to this project:
1. Create a feature branch
2. Make your changes
3. Ensure CI passes
4. Create a pull request using the provided template
5. Address any review feedback

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring/)
