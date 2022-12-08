import murmur2 from "./hash"

export const liteStyled = {
  button: undefined,
}

const classNameSet = new Set()

const Insertion = ({ classNameHash, styles }) => {
  classNameSet.add(classNameHash)
  const rules = `.${classNameHash} { ${styles} }`

  return <style dangerouslySetInnerHTML={{ __html: rules }} />
}

const getClassName = (styles) => {
  const hash = murmur2(styles)
  return `lite-styled-hash-${hash}`
}

liteStyled.button = (...args) => {
  const FinalTag = "button"

  return (props) => {
    const styles = args[0][0].trim()
    const className = getClassName(styles)

    return (
      <>
        {!classNameSet.has(className) && (
          <Insertion classNameHash={className} styles={styles} />
        )}

        <FinalTag {...props} className={className} />
      </>
    )
  }
}

export default liteStyled
