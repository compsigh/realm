import AboutMarkdown from './about.mdx'

export default function About() {
  return (
    <div className='mx-8 my-8'>
      <article className="prose dark:prose-invert">
        <AboutMarkdown />
      </article>
    </div>
  )
}
