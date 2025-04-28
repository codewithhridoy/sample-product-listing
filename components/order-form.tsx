"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { placeOrder } from "@/services/api"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  c_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  c_phone: z
    .string()
    .min(11, { message: "Phone number must be at least 11 digits" })
    .regex(/^01[3-9]\d{8}$/, { message: "Must be a valid Bangladeshi phone number (e.g., 01712345678)" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  courier: z.string({ required_error: "Please select a courier service" }),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1" }),
})

interface OrderFormProps {
  productId: string | number
  productPrice: number
}

export default function OrderForm({ productId, productPrice }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      c_name: "",
      c_phone: "",
      address: "",
      courier: "",
      quantity: 1,
    },
  })

  const quantity = form.watch("quantity")
  const deliveryCharge = 80
  const totalAmount = productPrice * quantity + deliveryCharge

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const orderData = {
        product_ids: productId.toString(),
        s_product_qty: values.quantity.toString(),
        c_name: values.c_name,
        c_phone: values.c_phone,
        address: values.address,
        courier: values.courier,
        advance: null,
        cod_amount: totalAmount.toString(),
        discount_amount: null,
        delivery_charge: deliveryCharge.toString(),
      }

      const response = await placeOrder(orderData)

      if (response.data?.data?.status === false && response.data?.data?.error) {
        // Handle field-specific errors from the API
        const apiErrors = response.data.error

        // Set errors for each field returned by the API
        Object.entries(apiErrors).forEach(([field, errors]) => {
          if (Array.isArray(errors) && errors.length > 0) {
            form.setError(field as any, {
              type: "manual",
              message: errors[0] as string,
            })
          }
        })

        toast({
          title: "Order placement failed",
          description: "Please check the form for errors and try again.",
          variant: "destructive",
        })
      } else if (response.status === 200 && response.data?.data?.status !== false) {
        toast({
          title: "Order placed successfully!",
          description: "We'll contact you soon to confirm your order.",
        })

        form.reset()
      } else {
        toast({
          title: "Order placement failed",
          description: "There was an error placing your order. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Order placement failed:", error)
      toast({
        title: "Order placement failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="c_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="c_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number (e.g., 01712345678)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your full delivery address" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="courier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Courier Service</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select courier service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="steadfast">Steadfast</SelectItem>
                    <SelectItem value="pathao">Pathao</SelectItem>
                    <SelectItem value="redx">RedX</SelectItem>
                    <SelectItem value="paperfly">Paperfly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span>Product Price:</span>
            <span>
              ৳{productPrice} × {quantity} = ৳{productPrice * quantity}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge:</span>
            <span>৳{deliveryCharge}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total Amount:</span>
            <span>৳{totalAmount}</span>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </Button>
      </form>
    </Form>
  )
}
