'use client';

import {
  Zap,
  FileJson,
  FileText,
  ToggleLeft,
  Code2,
  FolderTree,
  ArrowRight,
  Github,
} from 'lucide-react';
import styles from './landing-page.module.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  foundation,
  dracula,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useEffect, useState } from 'react';

const lightCodeStyle = foundation;
const darkCodeStyle = dracula;

export default function LandingPage() {
  const [codeStyle, setCodeStyle] = useState(lightCodeStyle);

  function updateCodeStyle() {
    const html = document.querySelector('html');
    const theme = html.getAttribute('data-theme');
    if (theme === 'dark') {
      setCodeStyle(darkCodeStyle);
    } else {
      setCodeStyle(lightCodeStyle);
    }
  }

  useEffect(() => {
    updateCodeStyle();
    const html = document.querySelector('html');

    const observer = new MutationObserver(updateCodeStyle);
    observer.observe(html, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroContent}>
                <div className={styles.heroTextContainer}>
                  <h1 className={styles.heroTitle}>
                    Yelix: The Modern Web Server Library for Deno
                  </h1>
                  <p className={styles.heroDescription}>
                    Simplify your backend development with automated features,
                    built-in data validation, and auto-generated API
                    documentation.
                  </p>
                </div>
                <div className={styles.buttonGroup}>
                  <a href="#get-started" className={styles.primaryButtonLarge}>
                    Get Started <ArrowRight className={styles.buttonIcon} />
                  </a>
                  <a
                    href="https://github.com/yelixjs/yelix"
                    target="_blank"
                    className={styles.secondaryButtonLarge}
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
              <div className={styles.codeCard}>
                <div className={styles.codeHeader}>
                  <div className={styles.codeDots}>
                    <div className={styles.redDot}></div>
                    <div className={styles.yellowDot}></div>
                    <div className={styles.greenDot}></div>
                    <span>main.ts</span>
                  </div>
                </div>
                <div className={styles.codeBlock}>
                  <SyntaxHighlighter language="typescript" style={codeStyle}>
                    {`import { Yelix } from "jsr:@murat/yelix";
import * as path from "jsr:@std/path@1.0.8";

async function main() {
  // Port is 3030 by default
  const app = new Yelix();

  // Load endpoints from a 'api' folder
  const currentDir = Deno.cwd();
  const API_Folder = path.join(currentDir, 'api');
  await app.loadEndpointsFromFolder(API_Folder);

  app.serve();
}

await main();`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className={styles.featuresSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Powerful Features</h2>
              <p className={styles.sectionDescription}>
                Yelix comes packed with features to make your backend
                development faster and more efficient.
              </p>
            </div>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIconContainer}>
                  <Zap className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>Hono-based Routing</h3>
                <p className={styles.featureDescription}>
                  Fast and lightweight request handling powered by the Hono
                  framework.
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIconContainer}>
                  <FileJson className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>Data Validation</h3>
                <p className={styles.featureDescription}>
                  Automatic query and body validation using Zod schemas.
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIconContainer}>
                  <FileText className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>OpenAPI 3.1</h3>
                <p className={styles.featureDescription}>
                  Auto-generates comprehensive API documentation with minimal
                  setup.
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIconContainer}>
                  <ToggleLeft className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>Optional Automation</h3>
                <p className={styles.featureDescription}>
                  Enable or disable features as needed for your specific project
                  requirements.
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIconContainer}>
                  <Code2 className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>Deno-native</h3>
                <p className={styles.featureDescription}>
                  Designed specifically for Deno with full TypeScript support.
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIconContainer}>
                  <FolderTree className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>API Folder Structure</h3>
                <p className={styles.featureDescription}>
                  Load endpoints from dedicated folders for better organization.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className={styles.examplesSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Code Examples</h2>
              <p className={styles.sectionDescription}>
                See how easy it is to build powerful APIs with Yelix.
              </p>
            </div>
            <div className={styles.examplesContainer}>
              <div className={styles.codeCard}>
                <div className={styles.codeCardHeader}>
                  <h3 className={styles.codeCardTitle}>
                    Basic Route
                  </h3>
                </div>
                <div className={styles.codeBlock}>
                  <SyntaxHighlighter language="typescript" style={codeStyle}>
                    {`import { Ctx } from "jsr:@murat/yelix";

export async function GET(ctx: Ctx) {
  return await ctx.text('Hello world!', 200);
}

export const path = '/api/hello';
`}
                  </SyntaxHighlighter>
                </div>
              </div>

              <div className={styles.codeCard}>
                <div className={styles.codeCardHeader}>
                  <h3 className={styles.codeCardTitle}>
                  Basic Route with Validation
                  </h3>
                </div>

                <div className={styles.codeBlock}>
                  <SyntaxHighlighter language="typescript" style={codeStyle}>
                    {`import { Ctx, ValidationType } from "jsr:@murat/yelix";

export async function GET(ctx: Ctx) {
  const requestData = ctx.get('dataValidation').user;
  const query = requestData.query;

  return await ctx.text('Hello, ' + query.name, 200);
}

export const path = '/api/hello';
export const middlewares = ['dataValidation'];

export const validation: ValidationType = {
  query: {
    name: inp().string(),
  },
};
`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="get-started" className={styles.getStartedSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Get Started</h2>
              <p className={styles.sectionDescription}>
                Start building with Yelix in just a few simple steps.
              </p>
            </div>
            <div className={styles.getStartedContainer}>
              <div className={styles.stepCard}>
                <h3 className={styles.stepTitle}>1. Generate Template</h3>
                <pre className={styles.codeBlock}>
                  <code>deno run --allow-write --allow-read https://docs.yelix.dev/yelix-template.ts</code>
                </pre>
              </div>

              {/* <div className={styles.stepCard}>
                <h3 className={styles.stepTitle}>2. Create Your First App</h3>

                <div className={styles.codeBlock}>
                  <SyntaxHighlighter language="typescript" style={codeStyle}>
                    {`// main.ts
import { Yelix } from "jsr:@murat/yelix";

async function main() {
  const app = new Yelix();

  const hello: Endpoint = {
    path: "/hello",
    GET: (ctx: Ctx) => {
      return ctx.json({ message: "Hello World!" });
    }
  }
  app.loadEndpoints([hello])

  app.serve();
}

await main();`}
                  </SyntaxHighlighter>
                </div>
              </div> */}

              <div className={styles.stepCard}>
                <h3 className={styles.stepTitle}>2. Run Your App</h3>
                <pre className={styles.codeBlock}>
                  <code>deno task dev</code>
                </pre>
              </div>

              <div className={styles.buttonContainer}>
                <a href="#docs" className={styles.primaryButtonLarge}>
                  Read the Documentation{' '}
                  <ArrowRight className={styles.buttonIcon} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="docs" className={styles.docsSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Documentation</h2>
              <p className={styles.sectionDescription}>
                Comprehensive guides and API references to help you build with
                Yelix.
              </p>
            </div>
            <div className={styles.docsGrid}>
              <a href="/docs/intro" className={styles.docCard}>
                <div className={styles.docIconContainer}>
                  <Code2 className={styles.docIcon} />
                </div>
                <h3 className={styles.docTitle}>Tutorials</h3>
                <p className={styles.docDescription}>
                  Step-by-step guides to build common backend patterns with
                  Yelix.
                </p>
              </a>
              <a
                href="https://jsr.io/@murat/yelix/doc"
                className={styles.docCard}
              >
                <div className={styles.docIconContainer}>
                  <FileText className={styles.docIcon} />
                </div>
                <h3 className={styles.docTitle}>API Reference</h3>
                <p className={styles.docDescription}>
                  Detailed documentation of all Yelix APIs and components.
                </p>
              </a>

              <a
                href="https://github.com/yelixjs/yelix"
                className={styles.docCard}
              >
                <div className={styles.docIconContainer}>
                  <Github className={styles.docIcon} />
                </div>
                <h3 className={styles.docTitle}>Examples</h3>
                <p className={styles.docDescription}>
                  Browse example projects and code snippets on GitHub.
                </p>
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <img
              src="/img/logo.svg"
              alt="Yelix Logo"
              style={{
                minWidth: 32,
              }}
            />
            <span
              style={{
                fontWeight: 700,
              }}
            >
              Yelix
            </span>
          </div>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Yelix. All rights reserved.
          </p>
          <div className={styles.footerLinks}>
            <a
              href="https://github.com/yelixjs/yelix"
              className={styles.footerLink}
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
