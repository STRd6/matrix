(function() {
  var Matrix, Point, frozen, isObject;

  Point = require("point");

  Matrix = function(a, b, c, d, tx, ty) {
    var _ref;
    if (isObject(a)) {
      _ref = a, a = _ref.a, b = _ref.b, c = _ref.c, d = _ref.d, tx = _ref.tx, ty = _ref.ty;
    }
    return {
      __proto__: Matrix.prototype,
      a: a != null ? a : 1,
      b: b != null ? b : 0,
      c: c != null ? c : 0,
      d: d != null ? d : 1,
      tx: tx != null ? tx : 0,
      ty: ty != null ? ty : 0
    };
  };

  Matrix.prototype = {
    concat: function(matrix) {
      return Matrix(this.a * matrix.a + this.c * matrix.b, this.b * matrix.a + this.d * matrix.b, this.a * matrix.c + this.c * matrix.d, this.b * matrix.c + this.d * matrix.d, this.a * matrix.tx + this.c * matrix.ty + this.tx, this.b * matrix.tx + this.d * matrix.ty + this.ty);
    },
    copy: function() {
      return Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    },
    deltaTransformPoint: function(point) {
      return Point(this.a * point.x + this.c * point.y, this.b * point.x + this.d * point.y);
    },
    inverse: function() {
      var determinant;
      determinant = this.a * this.d - this.b * this.c;
      return Matrix(this.d / determinant, -this.b / determinant, -this.c / determinant, this.a / determinant, (this.c * this.ty - this.d * this.tx) / determinant, (this.b * this.tx - this.a * this.ty) / determinant);
    },
    rotate: function(theta, aboutPoint) {
      return this.concat(Matrix.rotation(theta, aboutPoint));
    },
    scale: function(sx, sy, aboutPoint) {
      return this.concat(Matrix.scale(sx, sy, aboutPoint));
    },
    skew: function(skewX, skewY) {
      return this.concat(Matrix.skew(skewX, skewY));
    },
    toString: function() {
      return "Matrix(" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.tx + ", " + this.ty + ")";
    },
    transformPoint: function(point) {
      return Point(this.a * point.x + this.c * point.y + this.tx, this.b * point.x + this.d * point.y + this.ty);
    },
    translate: function(tx, ty) {
      return this.concat(Matrix.translation(tx, ty));
    }
  };

  Matrix.rotate = Matrix.rotation = function(theta, aboutPoint) {
    var rotationMatrix;
    rotationMatrix = Matrix(Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta));
    if (aboutPoint != null) {
      rotationMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(rotationMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));
    }
    return rotationMatrix;
  };

  Matrix.scale = function(sx, sy, aboutPoint) {
    var scaleMatrix;
    sy = sy || sx;
    scaleMatrix = Matrix(sx, 0, 0, sy);
    if (aboutPoint) {
      scaleMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(scaleMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));
    }
    return scaleMatrix;
  };

  Matrix.skew = function(skewX, skewY) {
    return Matrix(0, Math.tan(skewY), Math.tan(skewX), 0);
  };

  Matrix.translate = Matrix.translation = function(tx, ty) {
    return Matrix(1, 0, 0, 1, tx, ty);
  };

  isObject = function(object) {
    return Object.prototype.toString.call(object) === "[object Object]";
  };

  frozen = function(object) {
    if (typeof Object.freeze === "function") {
      Object.freeze(object);
    }
    return object;
  };

  Matrix.IDENTITY = frozen(Matrix());

  Matrix.HORIZONTAL_FLIP = frozen(Matrix(-1, 0, 0, 1));

  Matrix.VERTICAL_FLIP = frozen(Matrix(1, 0, 0, -1));

  module.exports = Matrix;

}).call(this);

//# sourceURL=matrix.coffee