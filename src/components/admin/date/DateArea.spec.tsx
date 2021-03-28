import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import DateArea from './DateArea'

describe('DateArea', () => {
  describe('UI', () => {
    let container: Element

    beforeEach(() => {
      // setup a DOM element as a render target
      container = document.createElement('div')
      document.body.appendChild(container)
    })

    afterEach(() => {
      // cleanup on exiting
      unmountComponentAtNode(container)
      container.remove()
    })

    it('renders without parameter', () => {
      // Act
      act(() => {
        render(<DateArea />, container)
      })
      // Assert
      expect(container).toBeDefined()
    })
  })

  describe('Methods', () => {
    it('render()', () => {
      // Arrange
      const component: DateArea = new DateArea({})
      // Act
      const ele: JSX.Element = component.render()
      // Assert
      expect(ele).toBeDefined()
    })
  })
})
