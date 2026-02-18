import type { BaseComponent } from '../../types/react'

export const compareContext = (...args: BaseComponent[]) => {
  return args.reduceRight((acc, Component) => <Component>{acc}</Component>, <></>)

} 