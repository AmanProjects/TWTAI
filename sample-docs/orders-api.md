# Create A New Order

The Orders endpoint will be used to create orders. An order is created by the system when this endpoint is called by the client application, and the order is then stored in the database so that it can be retrieved later by other parts of the system or by the user who wants to see their order history.

## Parameters

- customer_id: the customer
- items: the items
- coupon: a coupon
- notes: notes

## Response

A JSON object is returned by the endpoint.

## Example

```
curl https://api.example.com/orders
```

## Notes

The endpoint uses idempotency for safety. Make sure to pass the right values. The order will be processed asynchronously and a webhook will be fired when it is done.
