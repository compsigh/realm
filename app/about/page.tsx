import AboutMarkdown from './about.mdx'

export default function About() {
  return (
    <div>
      <article className="prose dark:prose-invert">
        <AboutMarkdown />
      </article>
    </div>
  )
}
