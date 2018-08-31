#include "bbox.h"

#include "GL/glew.h"
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

namespace CGL {

bool BBox::intersect(const Ray& r, double& t0, double& t1) const {

  // TODO (Part 2.2):
  // Implement ray - bounding box intersection test
  // If the ray intersected the bouding box within the range given by
  // t0, t1, update t0 and t1 with the new intersection times.

  // Idea is to clip the ray into the box
  // Help from https://tavianator.com/fast-branchless-raybounding-box-intersections/
  double t_min = -INFINITY;
  double t_max = INFINITY;

  for (uint_fast8_t axis  = 0; axis < 3; axis++) {
    double axis_min = std::min(min[axis], max[axis]);
    double axis_max = std::max(min[axis], max[axis]);
    double time_1 = (axis_min - r.o[axis]) / r.d[axis];
    double time_2 = (axis_max - r.o[axis]) / r.d[axis];
    t_min = std::max(t_min, std::min(time_1, time_2));
    t_max = std::min(t_max, std::max(time_1, time_2));
  }

  if (t_max >= t_min) {
    t0 = t_min;
    t1 = t_max;
    return true;
  } else {
    return false;
  }
}

void BBox::draw(Color c) const {

  glColor4f(c.r, c.g, c.b, c.a);

	// top
	glBegin(GL_LINE_STRIP);
	glVertex3d(max.x, max.y, max.z);
  glVertex3d(max.x, max.y, min.z);
  glVertex3d(min.x, max.y, min.z);
  glVertex3d(min.x, max.y, max.z);
  glVertex3d(max.x, max.y, max.z);
	glEnd();

	// bottom
	glBegin(GL_LINE_STRIP);
  glVertex3d(min.x, min.y, min.z);
  glVertex3d(min.x, min.y, max.z);
  glVertex3d(max.x, min.y, max.z);
  glVertex3d(max.x, min.y, min.z);
  glVertex3d(min.x, min.y, min.z);
	glEnd();

	// side
	glBegin(GL_LINES);
	glVertex3d(max.x, max.y, max.z);
  glVertex3d(max.x, min.y, max.z);
	glVertex3d(max.x, max.y, min.z);
  glVertex3d(max.x, min.y, min.z);
	glVertex3d(min.x, max.y, min.z);
  glVertex3d(min.x, min.y, min.z);
	glVertex3d(min.x, max.y, max.z);
  glVertex3d(min.x, min.y, max.z);
	glEnd();

}

std::ostream& operator<<(std::ostream& os, const BBox& b) {
  return os << "BBOX(" << b.min << ", " << b.max << ")";
}

} // namespace CGL
