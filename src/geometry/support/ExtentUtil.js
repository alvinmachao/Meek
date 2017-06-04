/**
 * Created by zhangyong on 2017/5/24.
 */


export const ExtentUtil = {}

/**
 * Create an empty extent.
 * @returns {[*,*,*,*]}
 */
ExtentUtil.createEmpty = function () {
  return [Infinity, Infinity, -Infinity, -Infinity]
}

/**
 * Create an empty extent.
 * @returns {[*,*,*,*]}
 */
ExtentUtil.createScaleExtent = function (center,value) {
  return [center.x  - value, center.y  - value, center.x  + value, center.y + value]
}

/**
 *
 * @param point1
 * @param point2
 * @returns {[*,*,*,*]}
 */
ExtentUtil.boundingExtentFromTwoPoints = function (point1, point2) {
  let xmin = 0, ymin = 0, xmax = 0, ymax = 0
  
  if (point1[0] > point2[0]) {
    xmin = point2[0]
    xmax = point1[0]
  } else {
    xmin = point1[0]
    xmax = point2[0]
  }
  
  if (point1[1] > point2[1]) {
    ymin = point2[1]
    ymax = point1[1]
  } else {
    ymin = point1[1]
    ymax = point2[1]
  }
  
  return [xmin, ymin, xmax, ymax]
}

/**
 * Build an extent that includes all given coordinates.
 * @param extent
 * @param coordinate
 */
ExtentUtil.boundingExtent = function (coordinates) {
  let extent = ExtentUtil.createEmpty()
  
  for (let i = 0, ii = coordinates.length; i < ii; ++i) {
    ExtentUtil.extendCoordinate(extent, coordinates[i])
  }
  
  return [
    ExtentUtil.getBottomLeft(extent),
    ExtentUtil.getBottomRight(extent),
    ExtentUtil.getTopRight(extent),
    ExtentUtil.getTopLeft(extent),
    ExtentUtil.getBottomLeft(extent)
  ]
}

/**
 * Build an extent that includes all given coordinates.
 * @param extent
 * @param coordinate
 */
ExtentUtil.boundingSimpleExtent = function (coordinates) {
  let extent = ExtentUtil.createEmpty()
  
  for (let i = 0, ii = coordinates.length; i < ii; ++i) {
    ExtentUtil.extendCoordinate(extent, coordinates[i])
  }
  
  return extent
}

/**
 * Combine an extent from the given coordinates.
 * @param extent
 * @param coordinate
 */
ExtentUtil.extendCoordinate = function(extent, coordinate) {
  if (coordinate[0] < extent[0]) {
    extent[0] = coordinate[0]
  }
  
  if (coordinate[0] > extent[2]) {
    extent[2] = coordinate[0]
  }
  
  if (coordinate[1] < extent[1]) {
    extent[1] = coordinate[1]
  }
  
  if (coordinate[1] > extent[3]) {
    extent[3] = coordinate[1]
  }
}


/**
 * Get the bottom right coordinate of an extent
 * @param extent
 * @returns {[*,*]}
 */
ExtentUtil.getBottomRight = function (extent) {
  return [extent[2], extent[1]]
}


/**
 * Get the bottom left coordinate of an extent
 * @param extent
 * @returns {[*,*]}
 */
ExtentUtil.getBottomLeft = function (extent) {
  return [extent[0], extent[1]]
}


/**
 * Get the top right coordinate of an extent
 * @param extent
 * @returns {[*,*]}
 */
ExtentUtil.getTopRight = function (extent) {
  return [extent[2], extent[3]]
}


/**
 * Get the top left coordinate of an extent
 * @param extent
 * @returns {[*,*]}
 */
ExtentUtil.getTopLeft = function (extent) {
  return [extent[0], extent[3]]
}

/**
 * Check if a passed point is contained or on the edge of the extent.
 * @param extent
 * @param point
 */
ExtentUtil.containsPoint = function(extent, point){
  const x = point[0]
  const y = point[1]
  
  if (Array.isArray(extent)) {
    return extent[0] <= x && x <= extent[2] &&
           extent[1] <= y && y <= extent[3]
  } else {
    return extent.xmin <= x && x <= extent.xmax &&
           extent.ymin <= y && y <= extent.ymax
  }
}

/**
 * Return extent increased by the provided value.
 * @param extent
 * @param value
 * @param optExtent
 * @returns {*}
 */
ExtentUtil.buffer = function(extent, value, optExtent) {
  if (optExtent) {
    optExtent[0] = extent[0] - value
    optExtent[1] = extent[1] - value
    optExtent[2] = extent[2] + value
    optExtent[3] = extent[3] + value
    return optExtent
  } else {
    return [
      extent[0] - value,
      extent[1] - value,
      extent[2] + value,
      extent[3] + value
    ]
  }
}

/**
 * Convert xmin, ymin, xmax, ymax of an extent to a ring array
 * @param xmin
 * @param ymin
 * @param xmax
 * @param ymax
 * @returns {[*,*,*,*,*]}
 */
ExtentUtil.minMaxToRing = function (xmin, ymin, xmax, ymax) {
  const ring = [
    [xmin, ymin],
    [xmax, ymin],
    [xmax, ymax],
    [xmin, ymax],
    [xmin, ymin]
  ]
  
  return ring
}


ExtentUtil.updateExtent = function (geometry, newCoordinates, dragSegments) {
  const dragSegment = dragSegments[0]
  const index = dragSegment.index
  const extentCoordinates = geometry.getCoordinates()[0]
  const segment1 = extentCoordinates[index]
  const segment2 = extentCoordinates[index + 1]
  
  const isVertex = dragSegment.isVertex
  if (isVertex) {
    if (index === 0 || index === 4) {
      extentCoordinates[0] = newCoordinates
      extentCoordinates[4] = newCoordinates
      extentCoordinates[1][1] = newCoordinates[1]
      extentCoordinates[3][0] = newCoordinates[0]
    } else if (index === 1) {
      extentCoordinates[1] = newCoordinates
      
      extentCoordinates[2][0] = newCoordinates[0]
      extentCoordinates[0][1] = newCoordinates[1]
      extentCoordinates[4] = extentCoordinates[0]
    } else if (index === 2) {
      extentCoordinates[2] = newCoordinates
      extentCoordinates[1][0] = newCoordinates[0]
      extentCoordinates[3][1] = newCoordinates[1]
    } else if (index === 3) {
      extentCoordinates[3] = newCoordinates
      extentCoordinates[2][1] = newCoordinates[1]
      extentCoordinates[0][0] = newCoordinates[0]
      extentCoordinates[4] = extentCoordinates[0]
    }
  } else {
    if (segment1[0] === segment2[0]) {
      extentCoordinates[index][0] = newCoordinates[0]
      extentCoordinates[index + 1][0] = newCoordinates[0]
    }
  
    if (segment1[1] === segment2[1]) {
      extentCoordinates[index][1] = newCoordinates[1]
      extentCoordinates[index + 1][1] = newCoordinates[1]
    }
  
    if (index === 3) {
      extentCoordinates[0] = extentCoordinates[4]
    }
  }
  
  
  return extentCoordinates
}