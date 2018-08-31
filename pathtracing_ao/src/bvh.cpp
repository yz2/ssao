#include "bvh.h"

#include "CGL/CGL.h"
#include "static_scene/triangle.h"

#include <iostream>
#include <stack>

using namespace std;

namespace CGL { namespace StaticScene {

BVHAccel::BVHAccel(const std::vector<Primitive *> &_primitives,
                   size_t max_leaf_size) {

  root = construct_bvh(_primitives, max_leaf_size);

}

BVHAccel::~BVHAccel() {
  if (root) delete root;
}

BBox BVHAccel::get_bbox() const {
  return root->bb;
}

void BVHAccel::draw(BVHNode *node, const Color& c) const {
  if (node->isLeaf()) {
    for (Primitive *p : *(node->prims))
      p->draw(c);
  } else {
    draw(node->l, c);
    draw(node->r, c);
  }
}

void BVHAccel::drawOutline(BVHNode *node, const Color& c) const {
  if (node->isLeaf()) {
    for (Primitive *p : *(node->prims))
      p->drawOutline(c);
  } else {
    drawOutline(node->l, c);
    drawOutline(node->r, c);
  }
}

BVHNode *BVHAccel::construct_bvh(const std::vector<Primitive*>& prims, size_t max_leaf_size) {
  
  // TODO (Part 2.1):
  // Construct a BVH from the given vector of primitives and maximum leaf
  // size configuration. The starter code build a BVH aggregate with a
  // single leaf node (which is also the root) that encloses all the
  // primitives.

  BBox centroid_box, bbox;

  for (Primitive *p : prims) {
    BBox bb = p->get_bbox();
    bbox.expand(bb);
    Vector3D c = bb.centroid();
    centroid_box.expand(c);
  }

  BVHNode *node = new BVHNode(bbox);

  // Few enough items in our bounding box? Return.
  if (prims.size() <= max_leaf_size) {
    node->prims = new vector<Primitive *>(prims);
    return node;
  }

  // Otherwise, recurse into left and right.
  // Get largest axis index
  double max_extent = 0.0;
  uint_fast8_t split_axis = 0; // 0 = x, 1 = y, 2 = z
  for (uint_fast8_t i = 0; i < 3; i++) {
    if (bbox.extent[i] > max_extent) {
      max_extent = bbox.extent[i];
      split_axis = i;
    }
  }

  // Split point is the midpoint of this largest axis
  double split_point = min(bbox.min[split_axis], bbox.max[split_axis]) + max_extent/2.0;

  // Partition nodes into left and right based off of split point
  vector<Primitive*> left;
  vector<Primitive*> right;
  for (Primitive *p : prims) {
    double test_point = (p->get_bbox().centroid())[split_axis];
    if (test_point < split_point) {
      left.push_back(p);
    } else {
      right.push_back(p);
    }
  }

  // Edge case: left or right vectors are empty (would cause infinite recursion)
  if (left.empty() or right.empty()) {
    // Make left the vector with more elements
    if (left.size() < right.size()) { left.swap(right); }
    size_t half_size = left.size()/2;
    vector<Primitive*> left_half(left.begin(), left.begin() + half_size);
    vector<Primitive*> right_half(left.begin() + half_size, left.end());
    left = left_half;
    right = right_half;
  }

  node->l = construct_bvh(left, max_leaf_size);
  node->r = construct_bvh(right, max_leaf_size);
  return node;
}


bool BVHAccel::intersect(const Ray& ray, BVHNode *node) const {
  // TODO (Part 2.3):
  // Fill in the intersect function.
  // Take note that this function has a short-circuit that the
  // Intersection version cannot, since it returns as soon as it finds
  // a hit, it doesn't actually have to find the closest hit.

  bool hit = false;
  double t0, t1;
  if (!node->bb.intersect(ray, t0, t1)) {
    return false;
  }

  if (node->isLeaf()) {
    for (Primitive *p : *(node->prims)) {
      if (p->intersect(ray)) {
        total_isects++;
        return true;
      }
    }
    return hit;
  }

  bool hit_left = intersect(ray, node->l);
  bool hit_right = intersect(ray, node->r);
  return (hit_left or hit_right);
}

bool BVHAccel::intersect(const Ray& ray, Intersection* i, BVHNode *node) const {
  // TODO (Part 2.3):
  // Fill in the intersect function.

  bool hit = false;
  double t0, t1;
  if (!node->bb.intersect(ray, t0, t1)) {
    return false;
  }

  if (node->isLeaf()) {
    for (Primitive *p : *(node->prims)) {
      if (p->intersect(ray, i)) {
        total_isects++;
        hit = true;
      }
    }
    return hit;
  }

  bool hit_left = intersect(ray, i, node->l);
  bool hit_right = intersect(ray, i, node->r);
  return (hit_left or hit_right);
}

}  // namespace StaticScene
}  // namespace CGL
