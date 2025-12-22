"use client"

import { useState } from "react"
import { products, updateProduct, deleteProduct, addProduct, customCategories } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Edit, Plus, Trash2 } from "lucide-react"

export default function ProductsPage() {
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    sizes: "",
    inStock: true,
    featured: false,
    newArrival: false,
    bestseller: false,
    fabric: "",
    care: "",
    customCategories: [] as string[],
  })

  const handleAddProduct = () => {
    const product = {
      id: `${products.length + 1}`,
      ...newProduct,
      sizes: newProduct.sizes.split(",").map((s) => s.trim()),
      images: ["/placeholder.svg?height=600&width=400"],
    }
    addProduct(product)
    setIsAddDialogOpen(false)
    setNewProduct({
      name: "",
      price: 0,
      description: "",
      category: "",
      sizes: "",
      inStock: true,
      featured: false,
      newArrival: false,
      bestseller: false,
      fabric: "",
      care: "",
      customCategories: [],
    })
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct({
      ...product,
      sizes: product.sizes.join(", "),
      customCategories: product.customCategories || [],
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateProduct = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...editingProduct,
        sizes: editingProduct.sizes.split(",").map((s: string) => s.trim()),
      })
      setIsEditDialogOpen(false)
      setEditingProduct(null)
    }
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id)
    }
  }

  const toggleProductTag = (tag: "featured" | "newArrival" | "bestseller", productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      updateProduct(productId, { [tag]: !product[tag] })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-neutral-600 mt-1">Manage your product catalog</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Tags</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-neutral-600">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">{product.category}</td>
                    <td className="py-4 px-4 font-medium">${product.price}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        <Badge
                          variant={product.featured ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleProductTag("featured", product.id)}
                        >
                          Featured
                        </Badge>
                        <Badge
                          variant={product.newArrival ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleProductTag("newArrival", product.id)}
                        >
                          New
                        </Badge>
                        <Badge
                          variant={product.bestseller ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleProductTag("bestseller", product.id)}
                        >
                          Bestseller
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={product.inStock ? "default" : "secondary"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="inline-flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Essential Cashmere Sweater"
                />
              </div>
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  placeholder="295"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Product description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  placeholder="Knitwear"
                />
              </div>
              <div className="space-y-2">
                <Label>Sizes (comma-separated)</Label>
                <Input
                  value={newProduct.sizes}
                  onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                  placeholder="XS, S, M, L, XL"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fabric</Label>
                <Input
                  value={newProduct.fabric}
                  onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                  placeholder="100% Cashmere"
                />
              </div>
              <div className="space-y-2">
                <Label>Care Instructions</Label>
                <Input
                  value={newProduct.care}
                  onChange={(e) => setNewProduct({ ...newProduct, care: e.target.value })}
                  placeholder="Dry clean only"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Custom Categories</Label>
              <Select
                onValueChange={(value) => {
                  if (!newProduct.customCategories.includes(value)) {
                    setNewProduct({
                      ...newProduct,
                      customCategories: [...newProduct.customCategories, value],
                    })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add to custom category" />
                </SelectTrigger>
                <SelectContent>
                  {customCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {newProduct.customCategories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => {
                      setNewProduct({
                        ...newProduct,
                        customCategories: newProduct.customCategories.filter((c) => c !== cat),
                      })
                    }}
                  >
                    {cat} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Tags</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProduct.featured}
                    onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                  />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProduct.newArrival}
                    onChange={(e) => setNewProduct({ ...newProduct, newArrival: e.target.checked })}
                  />
                  <span className="text-sm">New Arrival</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProduct.bestseller}
                    onChange={(e) => setNewProduct({ ...newProduct, bestseller: e.target.checked })}
                  />
                  <span className="text-sm">Bestseller</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProduct.inStock}
                    onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                  />
                  <span className="text-sm">In Stock</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sizes (comma-separated)</Label>
                  <Input
                    value={editingProduct.sizes}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sizes: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fabric</Label>
                  <Input
                    value={editingProduct.fabric || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Care Instructions</Label>
                  <Input
                    value={editingProduct.care || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, care: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Custom Categories</Label>
                <Select
                  onValueChange={(value) => {
                    const currentCategories = editingProduct.customCategories || []
                    if (!currentCategories.includes(value)) {
                      setEditingProduct({
                        ...editingProduct,
                        customCategories: [...currentCategories, value],
                      })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add to custom category" />
                  </SelectTrigger>
                  <SelectContent>
                    {customCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(editingProduct.customCategories || []).map((cat: string) => (
                    <Badge
                      key={cat}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => {
                        setEditingProduct({
                          ...editingProduct,
                          customCategories: editingProduct.customCategories.filter((c: string) => c !== cat),
                        })
                      }}
                    >
                      {cat} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Product Tags</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingProduct.featured || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingProduct.newArrival || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, newArrival: e.target.checked })}
                    />
                    <span className="text-sm">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingProduct.bestseller || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, bestseller: e.target.checked })}
                    />
                    <span className="text-sm">Bestseller</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    />
                    <span className="text-sm">In Stock</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateProduct}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
