Matrix
======

```
   _        _
  | a  c tx  |
  | b  d ty  |
  |_0  0  1 _|
```

Creates a matrix for 2d affine transformations.

`concat`, `inverse`, `rotate`, `scale` and `translate` return new matrices with
the transformations applied. The matrix is not modified in place.

Returns the identity matrix when called with no arguments.

    Matrix = (a, b, c, d, tx, ty) ->
      if isObject(a)
        {a, b, c, d, tx, ty} = a

      __proto__: Matrix.prototype
      a: a ? 1
      b: b ? 0
      c: c ? 0
      d: d ? 1
      tx: tx ? 0
      ty: ty ? 0

A `Point` constructor for the methods that return points. This can be overridden
with a compatible constructor if you want fancier points.

    Matrix.Point = require "point"

    Matrix.prototype =

`concat` returns the result of this matrix multiplied by another matrix
combining the geometric effects of the two. In mathematical terms,
concatenating two matrixes is the same as combining them using matrix multiplication.
If this matrix is A and the matrix passed in is B, the resulting matrix is A x B
http://mathworld.wolfram.com/MatrixMultiplication.html

      concat: (matrix) ->
        Matrix(
          @a * matrix.a + @c * matrix.b,
          @b * matrix.a + @d * matrix.b,
          @a * matrix.c + @c * matrix.d,
          @b * matrix.c + @d * matrix.d,
          @a * matrix.tx + @c * matrix.ty + @tx,
          @b * matrix.tx + @d * matrix.ty + @ty
        )


Return a new matrix that is a `copy` of this matrix.

      copy: ->
        Matrix(@a, @b, @c, @d, @tx, @ty)

Given a point in the pretransform coordinate space, returns the coordinates of
that point after the transformation occurs. Unlike the standard transformation
applied using the transformPoint() method, the deltaTransformPoint() method
does not consider the translation parameters tx and ty.

Returns a new `Point` transformed by this matrix ignoring tx and ty.

      deltaTransformPoint: (point) ->
        Matrix.Point(
          @a * point.x + @c * point.y,
          @b * point.x + @d * point.y
        )

Returns a new matrix that is the inverse of this matrix.
http://mathworld.wolfram.com/MatrixInverse.html

      inverse: ->
        determinant = @a * @d - @b * @c

        Matrix(
          @d / determinant,
          -@b / determinant,
          -@c / determinant,
          @a / determinant,
          (@c * @ty - @d * @tx) / determinant,
          (@b * @tx - @a * @ty) / determinant
        )

Returns a new matrix that corresponds this matrix multiplied by a
a rotation matrix.

The first parameter `theta` is the amount to rotate in radians.

The second optional parameter, `aboutPoint` is the point about which the
rotation occurs. Defaults to (0,0).

      rotate: (theta, aboutPoint) ->
        @concat(Matrix.rotation(theta, aboutPoint))

Returns a new matrix that corresponds this matrix multiplied by a
a scaling matrix.

      scale: (sx, sy, aboutPoint) ->
        @concat(Matrix.scale(sx, sy, aboutPoint))

Returns a new matrix that corresponds this matrix multiplied by a
a skewing matrix.

      skew: (skewX, skewY) ->
        @concat(Matrix.skew(skewX, skewY))

Returns a string representation of this matrix.

      toString: ->
        "Matrix(#{@a}, #{@b}, #{@c}, #{@d}, #{@tx}, #{@ty})"

Returns the result of applying the geometric transformation represented by the
Matrix object to the specified point.

      transformPoint: (point) ->
        Matrix.Point(
          @a * point.x + @c * point.y + @tx,
          @b * point.x + @d * point.y + @ty
        )

Translates the matrix along the x and y axes, as specified by the tx and ty parameters.

      translate: (tx, ty) ->
        @concat(Matrix.translation(tx, ty))

Creates a matrix transformation that corresponds to the given rotation,
around (0,0) or the specified point.

    Matrix.rotate = Matrix.rotation = (theta, aboutPoint) ->
      rotationMatrix = Matrix(
        Math.cos(theta),
        Math.sin(theta),
        -Math.sin(theta),
        Math.cos(theta)
      )

      if aboutPoint?
        rotationMatrix =
          Matrix.translation(aboutPoint.x, aboutPoint.y).concat(
            rotationMatrix
          ).concat(
            Matrix.translation(-aboutPoint.x, -aboutPoint.y)
          )

      return rotationMatrix

Returns a matrix that corresponds to scaling by factors of sx, sy along
the x and y axis respectively.

If only one parameter is given the matrix is scaled uniformly along both axis.

If the optional aboutPoint parameter is given the scaling takes place
about the given point.

    Matrix.scale = (sx, sy, aboutPoint) ->
      sy = sy || sx

      scaleMatrix = Matrix(sx, 0, 0, sy)

      if aboutPoint
        scaleMatrix =
          Matrix.translation(aboutPoint.x, aboutPoint.y).concat(
            scaleMatrix
          ).concat(
            Matrix.translation(-aboutPoint.x, -aboutPoint.y)
          )

      return scaleMatrix


Returns a matrix that corresponds to a skew of skewX, skewY.

    Matrix.skew = (skewX, skewY) ->
      Matrix(0, Math.tan(skewY), Math.tan(skewX), 0)

Returns a matrix that corresponds to a translation of tx, ty.

    Matrix.translate = Matrix.translation = (tx, ty) ->
      Matrix(1, 0, 0, 1, tx, ty)

Helpers
-------

    isObject = (object) ->
      Object.prototype.toString.call(object) is "[object Object]"

    frozen = (object) ->
      Object.freeze?(object)

      return object

Constants
---------

A constant representing the identity matrix.

    Matrix.IDENTITY = frozen Matrix()

A constant representing the horizontal flip transformation matrix.

    Matrix.HORIZONTAL_FLIP = frozen Matrix(-1, 0, 0, 1)

A constant representing the vertical flip transformation matrix.

    Matrix.VERTICAL_FLIP = frozen Matrix(1, 0, 0, -1)

Exports
-------

    module.exports = Matrix
