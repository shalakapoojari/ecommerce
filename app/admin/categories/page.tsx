"use client"

import { useState } from "react"
import { customCategories, addCustomCategory, deleteCustomCategory, products, updateProduct } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, FolderOpen } from "lucide-react"
import Link from "next/link"

export default function CategoriesPage() {
  const [newCategoryName, setNewCategoryName] = useState("")

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCustomCategory(newCategoryName.trim())
      setNewCategoryName("")
    }
  }

  const handleDeleteCategory = (category: string) => {
    if (confirm(`Are you sure you want to delete the "${category}" category?`)) {
      deleteCustomCategory(category)

      // Remove category from all products
      products.forEach((product) => {
        if (product.customCategories?.includes(category)) {
          updateProduct(product.id, {
            customCategories: product.customCategories.filter((c) => c !== category),
          })
        }
      })
    }
  }

  const getCategoryProductCount = (category: string) => {
    return products.filter((p) => p.customCategories?.includes(category)).length
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories Management</h1>
        <p className="text-neutral-600 mt-1">Create and manage custom product categories</p>
      </div>

      {/* Add New Category */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name (e.g., Spring Collection)"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddCategory()
                }
              }}
            />
            <Button onClick={handleAddCategory} className="inline-flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Categories */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories ({customCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customCategories.map((category) => (
              <div
                key={category}
                className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-neutral-400" />
                  <div>
                    <p className="font-medium">{category}</p>
                    <p className="text-sm text-neutral-600">{getCategoryProductCount(category)} products</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/collections/${category.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Default Categories Info */}
      <Card>
        <CardHeader>
          <CardTitle>Product Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              In addition to custom categories, you can mark products with the following tags directly from the Products
              page:
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Featured</Badge>
              <Badge variant="default">New Arrival</Badge>
              <Badge variant="default">Bestseller</Badge>
            </div>
            <Link href="/admin/products">
              <Button variant="outline" className="mt-4 bg-transparent">
                Go to Products
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
