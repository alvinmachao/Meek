/**
 * Created by zhangyong on 2017/3/20.
 */
import GeometryRender from '../render/GeomertyRender'

import {colorToString} from '../../utils/Helpers'

export default class PointRender extends GeometryRender {
  
  constructor (context) {
    super(context)
  }
  
  
  render (feature) {
    if(!feature){
      return
    }
    
    const ctx = this.context
    const styleArray = feature.style
    const geomerty = feature.geometry
    const len = styleArray.length
    for(let i = 0; i < len ; i ++){
      let styleObj = styleArray[i]
      
      let renderOptions = {
        centerX: geomerty.x,
        centerY: geomerty.y,
        radius: styleObj.size / 2 || styleObj.borderStyle.width / 2,
        fillStyle: colorToString(styleObj.color,styleObj.alpha),
        borderStyle: styleObj.borderStyle
      }
      
      this.drawCircle(ctx,renderOptions)
    }
    
  }
  
  drawCircle (ctx,renderOptions) {
    // console.log('类型为圆，开始绘制圆')
    ctx.save()
    ctx.beginPath()
    ctx.arc(renderOptions.centerX, renderOptions.centerY,
            renderOptions.radius, 0, 2 * Math.PI, true)
  
    if (renderOptions.fillStyle) {
      ctx.fillStyle = renderOptions.fillStyle
      ctx.fill()
    }
    
    const borderStyle = renderOptions.borderStyle
    if (borderStyle) {
      ctx.strokeStyle = colorToString(borderStyle.color,borderStyle.alpha)
      ctx.lineWidth = borderStyle.width

      if (borderStyle.lineDash) {
        ctx.setLineDash(borderStyle.lineDash)
      }

      ctx.stroke()
    }
    
    ctx.closePath()
    ctx.restore()
  }
}